import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from 'src/status/entity/status.entity';
import { Period } from 'src/period/entity/period.entity';
import { MediaService } from 'src/media/media.service';
import { Contribution } from './entity/contribution.entity';
import { User } from 'src/user/entity/user.entity';
import { Role } from 'src/role/entity/role.entity';
import { ContributionService } from './contribution.service';
import { ContributionController } from './controllers/contribution.controller';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { Comment } from 'src/comment/entity/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contribution,
      Status,
      Period,
      User,
      Role,
      Comment,
    ]),
  ],
  controllers: [ContributionController],
  providers: [
    ContributionService,
    MediaService,
    FirebaseService,
    UserService,
    RoleService,
  ],
})
export class ContributionModule {}
