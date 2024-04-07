/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CurrentUser } from '../current-user.decorator';
import { SignInRequest } from 'src/user/dtos/signIn.dto';
import {
  CreateUserRequest,
  GetUserResponse,
} from 'src/user/dtos/create.user.dto';
import { AuthGuardLocal } from '../local.guard';
import { EmailUserRequest } from 'src/user/dtos/email.user.dto';
import { CodeRequest } from '../dtos/code.dto';
import { PasswordUserRequest } from 'src/user/dtos/password.user.dto';
import { RefreshJwtStrategy } from '../refreshToken.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('sign-in')
  @UseGuards(AuthGuardLocal)
  async login(@Body() signInRequest: SignInRequest) {
    return this.authService.login(signInRequest);
  }

  @Post('create-user')
  async create(@Body() createUserRequest: CreateUserRequest) {
    return await this.authService.createNewUser(createUserRequest);
  }

  @Post('send-code')
  async sendCodeResetPassword(@Body() { email }: EmailUserRequest) {
    return await this.authService.sendCodeResetPassword(email);
  }

  @Post('check-code')
  checkCode(@Body() { code }: CodeRequest) {
    return this.authService.checkCodeVerify(code);
  }

  @Post('reset-password')
  async resetPassword(@Body() payload: PasswordUserRequest) {
    if (payload.password !== payload.rePassword)
      throw new BadRequestException('Re-password is not same !');

    const hashPass = await this.authService.hashPassword(payload.password);

    return this.authService.resetPassword(hashPass);
  }

  @UseGuards(RefreshJwtStrategy)
  @Post('refresh-token')
	async refreshToken(@Body() payload: SignInRequest) {
		this.authService.refreshToken(payload)
	}
}
