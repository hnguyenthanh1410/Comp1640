import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Faculty } from 'src/faculty/entity/faculty.entity';
import { Role, RoleName } from 'src/role/entity/role.entity';

export class CreateUserRequest {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  retypedPassword: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  faculty: string;

  @IsNotEmpty()
  @IsOptional()
  role?: RoleName;
}

export class GetUserResponse {
  @IsString()
  id: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  token?: string;

  faculty?: Faculty;

  role?: Role;

  avatar?: string;

  phone?: string;

  address?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;
}
