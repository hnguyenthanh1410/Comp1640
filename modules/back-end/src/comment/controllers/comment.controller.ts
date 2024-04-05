import {
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from '../comment.service';
import { CheckRole } from 'src/role/role.decorator';
import { RoleName } from 'src/role/entity/role.entity';
import { RoleGuard } from 'src/role/role.guard';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import {
  CreateCommentRequest,
  UpdateCommentRequest,
} from '../dtos/create.comment.dto';
import { User } from 'src/user/entity/user.entity';
import { DeleteResult } from 'typeorm';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/create')
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(RoleName.MARKETING_COORDINATOR, RoleName.STUDENT)
  async createComment(
    @Body() payload: CreateCommentRequest,
    @CurrentUser() user: User,
  ) {
    return await this.commentService.createComment(payload, user);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(RoleName.MARKETING_COORDINATOR, RoleName.STUDENT)
  async update(
    @Param('id') id,
    @Body() payload: UpdateCommentRequest,
    @CurrentUser() user: User,
  ) {
    const comment = await this.commentService.getComment(id);
    if (!comment) {
      throw new NotFoundException();
    }

    return await this.commentService.updateComment(comment, payload, user);
  }

  @Delete('remove/:id')
  @UseGuards(AuthGuardJwt, RoleGuard)
  @HttpCode(204)
  @CheckRole(RoleName.MARKETING_COORDINATOR, RoleName.STUDENT)
  async remove(
    @Param('id') id,
    @CurrentUser() user: User,
  ): Promise<DeleteResult> {
    const comment = await this.commentService.getComment(id);

    if (!comment) {
      throw new NotFoundException();
    }

    return await this.commentService.deleteComment(id, user.id);
  }
}
