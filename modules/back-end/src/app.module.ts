import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FacultyModule } from './faculty/faculty.module';
import { RoleModule } from './role/role.module';
import { MediaModule } from './media/media.module';
import { PeriodModule } from './period/period.module';
import { StatusModule } from './status/status.module';
import { ContributionModule } from './contribution/contributtion.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig,
    }),
    AuthModule,
    UserModule,
    FacultyModule,
    RoleModule,
    MediaModule,
    PeriodModule,
    StatusModule,
    ContributionModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
