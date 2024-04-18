import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { CommentService } from './comment.service';
import { Contribution } from 'src/contribution/entity/contribution.entity';
import { CommentController } from './controllers/comment.controller';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Contribution, User])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
