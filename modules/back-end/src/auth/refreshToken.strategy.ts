import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_REFRESH_SECRET,
		});
	}

	public async validate(req: Request, payload: any) {
		const refreshToken = await req.get('Authorization').replace('Bearer', '').trim();
		return { ...payload, refreshToken };
	}
}
