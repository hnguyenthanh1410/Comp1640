/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { SignInRequest } from 'src/user/dtos/signIn.dto';
import { CreateUserRequest } from 'src/user/dtos/create.user.dto';
import { AuthGuardLocal } from '../auth-guard.local.guard';
import { EmailUserRequest } from 'src/user/dtos/email.user.dto';
import { CodeRequest } from '../dtos/code.dto';
import { PasswordUserRequest } from 'src/user/dtos/password.user.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/role/role.guard';
import { CheckRole } from 'src/role/role.decorator';
import { RoleName } from 'src/role/entity/role.entity';

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

  @Post('create-user-with-role')
  @UseGuards(AuthGuard('jwtGate'), RoleGuard)
  @CheckRole(RoleName.ADMIN)
  async createUser(@Body() CreateUserRequest: CreateUserRequest) {
    return await this.authService.createNewUser(CreateUserRequest);
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

    const hashPass = await this.authService.hashData(payload.password);

    return this.authService.resetPassword(hashPass);
  }

  @Post('refresh-token')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(
      req.user['username'],
      req.headers.authorization,
    );
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwtGate'))
  async logout(@Req() req: Request) {
    await this.authService.logout(req.user['sub']);
  }
}
