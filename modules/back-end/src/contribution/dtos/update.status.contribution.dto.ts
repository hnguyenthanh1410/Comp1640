import { IsOptional, IsString } from 'class-validator';

export class UpdateStatusRequest {
  @IsOptional()
  @IsString()
  status?: string;
}
