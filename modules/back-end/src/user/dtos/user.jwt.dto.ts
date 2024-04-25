import { IsString } from 'class-validator';

export class UserFromJwt {
  @IsString()
  sub?: string;

  @IsString()
  username?: string;
}
