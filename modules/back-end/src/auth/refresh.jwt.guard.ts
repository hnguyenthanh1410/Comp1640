import { AuthGuard } from '@nestjs/passport';

export class AuthGuardRefreshJwt extends AuthGuard('jwt-refresh') {}
