/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contribution } from './entity/contribution.entity';
import { Repository } from 'typeorm';
import { MediaService } from 'src/media/media.service';
import { UserService } from 'src/user/user.service';
import { Period } from 'src/period/entity/period.entity';
import { Status } from 'src/status/entity/status.entity';
import {
  CreateContributionRequest,
  GetContributionResponse,
} from './dtos/create.contribution.dto';
import { User } from 'src/user/entity/user.entity';
import { UpdateContributionRequest } from './dtos/update.contribution.dto';
import { GetCommentResponse } from 'src/comment/dtos/create.comment.dto';
import { Comment } from 'src/comment/entity/comment.entity';
import { RoleName } from 'src/role/entity/role.entity';

@Injectable()
export class ContributionService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionRepository: Repository<Contribution>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly mediaService: MediaService,
    private readonly userService: UserService,
  ) {}

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

  private async getAllCommentByContribution(id: string) {
    return await this.commentRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC')
      .leftJoin('e.author', 'user')
      .leftJoinAndSelect('e.children', 'children')
      .leftJoinAndSelect('e.parent', 'parent')
      .addSelect([
        'user.id',
        'user.username',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.role',
        'user.faculty',
      ])
      .leftJoin('e.contribution', 'contribution')
      .andWhere('contribution.id = :id', { id })
      .getMany();
  }

  private getContributionBaseQuery() {
    return this.contributionRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  private async sendNotifyByEmail(email: string): Promise<object> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'danquene123@gmail.com',
        pass: 'kccb yxli mhxx jicf',
      },
      port: 587,
      secure: false,
      requireTLS: true,
    });
    const contributionLink = 'https://www.google.com/'; //link to detail submission
    const mailOptions = {
      from: 'danquene123@gmail.com',
      to: email,
      subject: 'Notification: Contribution Ready for Review',
      text:
        'Hello Coordinator,\nA new Contribution from a student is ready for review. Please click the link below to check:\n' +
        contributionLink +
        '\n\nThank you!',
      html: `
              <html>
                  <head>
                      <title>Contribution Notification</title>
                  </head>
                  <body>
                      <h1>Contribution Notification</h1>
                      <p>Hello Coordinator,</p>
                      <p>A new Contribution from a student is ready for review. Please click the link below to check:</p>
                      <p><a href="${contributionLink}">Check Contribution</a></p>
                      <p>Thank you!</p>
                  </body>
              </html>
          `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new BadRequestException('Error sending email !');
    }
  }

  private async sendEmailForCoordinator() {
    this.userService.getAllUsers().then(async (accountList) => {
      const coordinator = accountList.filter(
        (account) => account.role.name === RoleName.MARKETING_COORDINATOR,
      );
      const emailPromises = coordinator.map(async (account) =>
        this.sendNotifyByEmail(account.email),
      );

      await Promise.all(emailPromises)
        .then(() => console.log('Emails sent successfully!'))
        .catch((error) => console.error('Error sending emails:', error));
    });
  }

  public async getApprovedContributionList() {
    const contributionList = await this.getContributionBaseQuery().getMany();

    return contributionList.filter(
      (contribution) => contribution.status.name === 'Approved',
    );
  }

  public async getNotApprovedContributionList() {
    const contributionList = await this.getContributionBaseQuery().getMany();

    return contributionList.filter(
      (contribution) => contribution.status.name === 'Not approved',
    );
  }

  public async getContributionDetail(
    id: string,
  ): Promise<GetContributionResponse> {
    const contribution = await this.getContributionBaseQuery()
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
      .andWhere('e.id = :id', { id })
      .getOne();

    if (!contribution)
      throw new BadRequestException('Contribution not found !');

    const commentList = await this.getAllCommentByContribution(contribution.id);
    const commentsMapped = commentList.map((comment) =>
      this.mappedComment(comment),
    );
    const comments = commentsMapped.filter((comment) => !comment.parentId);

    return {
      id: contribution.id,
      name: contribution.name,
      description: contribution.description,
      createdAt: contribution.createdAt,
      files: contribution.files,
      status: contribution.status,
      period: contribution.period,
      author: contribution.author,
      faculty: contribution.author.faculty,
      comments,
    };
  }

  public async createContribution(
    payload: CreateContributionRequest,
    files: Array<Express.Multer.File>,
    user: User,
  ): Promise<GetContributionResponse> {
    let statusContribution = await this.statusRepository.findOne({
      where: {
        name: 'Not approved',
      },
    });
    if (!statusContribution) {
      const status = new Status();
      status.name = 'Not approved';
      status.description = 'A submission does not approved yet !';
      statusContribution = await this.statusRepository.save(status);
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const periodContribution = await this.periodRepository.findOne({
      where: {
        year: currentYear.toString(),
      },
    });
    const { password, ...info } = user;

    const fileUrl = Promise.all(
      files.map(async (file) => await this.mediaService.upload(file)),
    );
    payload.files = await fileUrl;

    const contribution = await this.contributionRepository.save({
      ...payload,
      status: statusContribution,
      period: periodContribution,
      createdAt: new Date(),
      author: info,
    });
    await this.sendEmailForCoordinator();
    return {
      ...contribution,
      faculty: user.faculty,
    };
  }

  public async updateContribution(
    payload: UpdateContributionRequest,
    files: Array<Express.Multer.File>,
    user: User,
    contribution: GetContributionResponse,
  ) {
    if (contribution.author.id === user.id) {
      const fileUrl = await Promise.all(
        files.map(async (file) => await this.mediaService.upload(file)),
      );
      payload.files = fileUrl;
      const data = await this.contributionRepository.save({
        ...contribution,
        name: payload.name,
        description: payload.description,
        files: payload.files,
      });
      return data;
    } else {
      throw new BadRequestException('You can not edit submission !');
    }
  }

  public async approveContribution(contribution: GetContributionResponse) {
    let statusContribution = await this.statusRepository.findOne({
      where: {
        name: 'Approved',
      },
    });

    if (!statusContribution) {
      const status = new Status();
      status.name = 'Approved';
      status.description = 'A submission is approved !';
      statusContribution = await this.statusRepository.save(status);
    }

    return await this.contributionRepository.save({
      ...contribution,
      status: statusContribution,
    });
  }
}