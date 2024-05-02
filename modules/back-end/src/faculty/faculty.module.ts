import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faculty } from './entity/faculty.entity';
import { FacultyController } from './controllers/faculty.controller';
import { FacultyService } from './faculty.service';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/entity/role.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';
import { MediaService } from 'src/media/media.service';
import { MediaModule } from 'src/media/media.module';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Faculty, Role, User]), MediaModule],
  controllers: [FacultyController],
  providers: [
    FacultyService,
    RoleService,
    UserService,
    MediaService,
    FirebaseService,
  ],
})
export class FacultyModule {}
