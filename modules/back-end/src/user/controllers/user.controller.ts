import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { ApiParam } from '@nestjs/swagger';
import { GetUserResponse } from '../dtos/create.user.dto';
import { AuthGuardJwt } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { CheckRole } from 'src/role/role.decorator';
import { RoleName } from 'src/role/entity/role.entity';
import { UpdateRoleRequest, UpdateUserRequest } from '../dtos/update.role.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiParam({
    name: 'id',
  })
  async getDetail(@Param('id') id: string): Promise<GetUserResponse> {
    return await this.userService.getUserDetail(id);
  }

  @Patch('update-role/:id')
  @ApiParam({
    name: 'id',
  })
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(RoleName.ADMIN)
  async updateRole(
    @Param('id') id: string,
    @Body() payload: UpdateRoleRequest,
  ): Promise<GetUserResponse> {
    const user = await this.getDetail(id);

    return await this.userService.updateRole(user, payload);
  }

  @Patch('update-information/:id')
  @ApiParam({
    name: 'id',
  })
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(
    RoleName.STUDENT,
    RoleName.ADMIN,
    RoleName.MARKETING_COORDINATOR,
    RoleName.MARKETING_MANAGER,
  )
  async updateInfo(
    @Param('id') id: string,
    @Body() payload: UpdateUserRequest,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<GetUserResponse> {
    const user = await this.getDetail(id);

    return await this.userService.updateUserInformation(user, image, payload);
  }
}
