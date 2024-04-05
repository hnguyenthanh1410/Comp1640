import { IsNotEmpty, IsOptional } from 'class-validator';
import { GetUserResponse } from 'src/user/dtos/create.user.dto';

export class CreateCommentRequest {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  contributionId: string;

  @IsOptional()
  parentId: string;
}

export class UpdateCommentRequest {
  @IsNotEmpty()
  content: string;
}

export class GetCommentResponse {
  id: string;

  content: string;

  author?: GetUserResponse;

  createdAt?: Date;

  updatedAt?: Date;

  contributionId?: string;

  children?: GetCommentResponse[];

  parentId?: string;
}
