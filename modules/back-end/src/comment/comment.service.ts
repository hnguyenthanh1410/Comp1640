/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Contribution } from 'src/contribution/entity/contribution.entity';
import {
  CreateCommentRequest,
  GetCommentResponse,
  UpdateCommentRequest,
} from './dtos/create.comment.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Contribution)
    private readonly contributionRepository: Repository<Contribution>,
  ) {}

  private getCommentsBaseQuery() {
    return this.commentRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  private mappedComment(comment: Comment): GetCommentResponse {
    const commentResponse: GetCommentResponse = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author,
      ...(comment.contribution && { contributionId: comment.contribution.id }),
      ...(comment.parent && { parentId: comment.parent.id }),
    };

    if (comment.children && comment.children.length) {
      commentResponse.children = comment.children.map((child) =>
        this.mappedComment(child),
      );
    }

    return commentResponse;
  }

  private async getContributionDetailQuery(id: string) {
    return await this.contributionRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC')
      .leftJoin('e.author', 'user')
      .addSelect([
        'user.id',
        'user.username',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.role',
        'user.faculty',
      ])
      .andWhere('e.id = :id', {
        id,
      })
      .getOne();
  }

  public async getComment(id: string) {
    const result = await this.getCommentsBaseQuery()
      .leftJoin('e.author', 'user')
      .leftJoinAndSelect('e.children', 'children')
      .leftJoinAndSelect('e.contribution', 'contribution')
      .addSelect([
        'user.id',
        'user.username',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.role',
        'user.faculty',
      ])
      .andWhere('e.id = :id', {
        id,
      })
      .getOne();
    return {
      id: result.id,
      content: result.content,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      author: result.author,
      contribution: result.contribution,
      parent: result.parent,
    };
  }

  public async createComment(payload: CreateCommentRequest, user: User) {
    const contribution = await this.getContributionDetailQuery(
      payload.contributionId,
    );

    let parentComment = null;
    if (payload.parentId) {
      parentComment = await this.commentRepository.findOne({
        where: {
          id: payload.parentId,
        },
      });
    }

    const insertResult = await this.commentRepository.insert({
      content: payload.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      contribution,
      parent: parentComment ?? null,
      author: user,
    });

    const commentId = insertResult.generatedMaps[0].id;
    const createdComment = await this.getComment(commentId);

    const { password, ...info } = user;
    const comment = {
      id: createdComment.id,
      content: createdComment.content,
      createdAt: createdComment.createdAt,
      updatedAt: createdComment.updatedAt,
      author: info,
      contributionId: createdComment.contribution.id,
      children: [],
      ...(createdComment.parent && { parentId: createdComment.parent.id }),
    };

    const parentCmt = await this.commentRepository.findOne({
      where: {
        id: payload.parentId,
      },
    });
    const payloadParam = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author,
      contribution,
      children: comment.children,
      contributionId: comment.contributionId,
      ...(comment.parentId && { parent: parentCmt }),
    };
    return this.mappedComment(payloadParam);
  }

  public async updateComment(
    comment: GetCommentResponse,
    payload: UpdateCommentRequest,
    user: User,
  ) {
    const contribution = await this.getContributionDetailQuery(
      comment.contributionId,
    );
    if (comment.author.id === user.id) {
      const updatedComment = await this.commentRepository.save({
        id: comment.id,
        content: payload.content,
        createdAt: comment.createdAt,
        updatedAt: new Date(),
        contribution,
        author: user,
      });
      const { password, ...info } = user;
      return {
        id: updatedComment.id,
        content: updatedComment.content,
        createdAt: updatedComment.createdAt,
        updatedAt: updatedComment.updatedAt,
        author: info,
        contribution: updatedComment.contribution.id,
      };
    }
    throw new BadRequestException('You can not update this comment !');
  }

  public async deleteComment(
    id: string,
    authorId: string,
  ): Promise<DeleteResult> {
    return await this.commentRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id and author = :authorId', {
        id,
        authorId,
      })
      .execute();
  }
}
