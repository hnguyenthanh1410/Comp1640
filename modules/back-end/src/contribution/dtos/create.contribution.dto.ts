import { IsString } from 'class-validator';
import { GetCommentResponse } from 'src/comment/dtos/create.comment.dto';
import { Faculty } from 'src/faculty/entity/faculty.entity';
import { Period } from 'src/period/entity/period.entity';
import { Status } from 'src/status/entity/status.entity';
import { GetUserResponse } from 'src/user/dtos/create.user.dto';

export class CreateContributionRequest {
  @IsString()
  name: string;

  @IsString()
  description: string;

  files?: string[];
}

export class GetContributionResponse {
  id: string;

  name: string;

  description: string;

  createdAt: Date;

  files: string[];

  status: Status;

  period: Period;

  faculty: Faculty;

  author?: GetUserResponse;

  comments?: GetCommentResponse[];
}
