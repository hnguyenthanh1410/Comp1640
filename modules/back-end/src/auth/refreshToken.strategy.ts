import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromBodyField("refresh_token"),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_REFRESH_SECRET,
		});
	}

	async validate(payload: any) {
		return await this.userRepository.findOne({
			where: {
				id: payload.sub,
			},
		});
	}
}
