import {
	Controller,
	Get,
	UseGuards,
  } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuardJwt } from 'src/auth/jwt.guard';
import { RoleGuard } from './role.guard';
import { CheckRole } from './role.decorator';
import { RoleName } from './entity/role.entity';
  
  @Controller('role')
  export class RoleController {
	constructor(private readonly roleService: RoleService) {}
  
	@Get('list')
	@UseGuards(AuthGuardJwt, RoleGuard)
	@CheckRole(
		RoleName.ADMIN
	)
	async getRoleName () {
		return await this.roleService.getAllRoles()
	}
  }
  