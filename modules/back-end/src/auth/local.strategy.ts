import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entity/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly authService: AuthService
  ) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);

    if (!user) throw new BadRequestException('User not found !');

    if (!await bcrypt.compare(password, user.password)) throw new BadRequestException('Wrong password !');

    return user;
  }
}
