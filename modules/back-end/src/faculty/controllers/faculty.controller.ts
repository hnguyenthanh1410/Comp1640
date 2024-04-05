import { Controller, Get } from '@nestjs/common';
import { FacultyService } from '../faculty.service';

@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get('get-all')
  async getListFaculty() {
    return await this.facultyService.getAllFaculties();
  }
}
