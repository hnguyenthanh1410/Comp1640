import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from './entity/period.entity';
import { CreatePeriodRequest } from './dtos/create.period.dto';

@Injectable()
export class PeriodService {
  constructor(
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
  ) {}

  public async createPeriod(payload: CreatePeriodRequest): Promise<Period> {
    return await this.periodRepository.save(payload);
  }
}
