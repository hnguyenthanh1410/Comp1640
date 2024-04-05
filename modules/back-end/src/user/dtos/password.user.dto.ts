import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PasswordUserRequest {
  @IsString()
  @Length(8)
  @IsNotEmpty()
  password: string;

  @IsString()
  @Length(8)
  @IsNotEmpty()
  rePassword: string;
}
