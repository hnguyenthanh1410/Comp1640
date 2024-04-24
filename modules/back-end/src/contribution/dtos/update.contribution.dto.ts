import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateContributionRequest {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDate()
  @IsOptional()
  dueDate?: Date;

  docs?: string[];

  photos?: string[];
}
