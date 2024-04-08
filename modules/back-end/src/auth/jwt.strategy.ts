import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwtGate') {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_ACCESS_SECRET,
		});
	}

	public validate(payload) {
		if (!payload) throw new UnauthorizedException('Unauthorized');

		return {
			sub: payload.sub,
			username: payload.username
		};
	}
}