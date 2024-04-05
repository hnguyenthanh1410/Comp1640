import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/entity/role.entity';
import { MediaModule } from 'src/media/media.module';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), MediaModule],
  providers: [UserService, RoleService],
  controllers: [UserController],
})
export class UserModule {}
