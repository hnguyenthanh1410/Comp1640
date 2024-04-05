import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from './entity/period.entity';
import { PeriodService } from './period.service';
import { PeriodController } from './controllers/period.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Period])],
  controllers: [PeriodController],
  providers: [PeriodService],
})
export class PeriodModule {}
