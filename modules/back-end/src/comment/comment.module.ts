import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { CommentService } from './comment.service';
import { Contribution } from 'src/contribution/entity/contribution.entity';
import { CommentController } from './controllers/comment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Contribution])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
