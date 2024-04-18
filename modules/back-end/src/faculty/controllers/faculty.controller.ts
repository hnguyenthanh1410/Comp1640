import { Controller, Get, UseGuards } from '@nestjs/common';
import { FacultyService } from '../faculty.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get('get-all')
  async getListFaculty() {
    return await this.facultyService.getAllFaculties();
  }
}
