import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faculty } from './entity/faculty.entity';
import { FacultyController } from './controllers/faculty.controller';
import { FacultyService } from './faculty.service';

@Module({
  imports: [TypeOrmModule.forFeature([Faculty])],
  controllers: [FacultyController],
  providers: [FacultyService],
})
export class FacultyModule {}
