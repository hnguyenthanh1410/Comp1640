import { Controller, Get, UseGuards } from '@nestjs/common';
import { FacultyService } from '../faculty.service';
import { RoleGuard } from 'src/role/role.guard';
import { CheckRole } from 'src/role/role.decorator';
import { RoleName } from 'src/role/entity/role.entity';
import { AuthGuardJwt } from 'src/auth/jwt.guard';

@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get('get-all')
  async getListFaculty() {
    return await this.facultyService.getAllFaculties();
  }

  @Get('count')
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(RoleName.ADMIN)
  async countFaculties() {
	return await this.facultyService.countFaculties();
  }
}
