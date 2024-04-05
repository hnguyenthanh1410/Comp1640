import { IsString } from 'class-validator';

export class UpdateContributionRequest {
  @IsString()
  name: string;

  @IsString()
  description: string;

  files?: string[];
}
