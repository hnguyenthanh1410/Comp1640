import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PeriodService } from '../period.service';
import { AuthGuardJwt } from 'src/auth/jwt.guard';
import { Period } from '../entity/period.entity';
import { CreatePeriodRequest } from '../dtos/create.period.dto';
import { CheckRole } from 'src/role/role.decorator';
import { RoleName } from 'src/role/entity/role.entity';
import { RoleGuard } from 'src/role/role.guard';

@Controller('period')
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  @Post('create')
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(RoleName.ADMIN)
  async createPeriod(@Body() payload: CreatePeriodRequest): Promise<Period> {
    return await this.periodService.createPeriod(payload);
  }
}
