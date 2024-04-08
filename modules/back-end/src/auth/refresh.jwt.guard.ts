import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuardRefreshJwt extends AuthGuard('jwt-refresh') {}
