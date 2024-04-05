import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faculty } from './entity/faculty.entity';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
  ) {}

  private getFacultyBaseQuery() {
    return this.facultyRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public async getAllFaculties() {
    return await this.getFacultyBaseQuery().getMany();
  }
}
