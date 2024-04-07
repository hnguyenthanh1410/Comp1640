import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { Faculty } from 'src/faculty/entity/faculty.entity';
import { Role } from 'src/role/entity/role.entity';
import { RoleService } from 'src/role/role.service';
import { MediaService } from 'src/media/media.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Faculty, Role]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthService,
    UserService,
    RoleService,
    MediaService,
    FirebaseService,
  ],
})
export class AuthModule {}
