import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';
import { MediaModule } from 'src/media/media.module';
import { MediaService } from 'src/media/media.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User]), MediaModule],
  providers: [RoleService, UserService, MediaService, FirebaseService],
  controllers: [RoleController],
})
export class RoleModule {}
