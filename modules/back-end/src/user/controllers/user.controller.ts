import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
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
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetUserRequest } from '../dtos/getUserRequest.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwtGate'), RoleGuard)
  @CheckRole(RoleName.ADMIN)
  async getAll(): Promise<GetUserResponse[]> {
    return await this.userService.getAllUsers();
  }

  @Get('getUserInfo')
  @UseGuards(AuthGuard('jwtGate'))
  async getUserInfo(@Req() req: Request) {
    return await this.userService.getUserInfo(req.user['username']);
  }

  @Get('count')
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(RoleName.ADMIN)
  async countStudent() {
	return await this.userService.countUser();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwtGate'))
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
  @UseGuards(AuthGuard('jwtGate'), RoleGuard)
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
  @UseGuards(AuthGuard('jwtGate'), RoleGuard)
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

  @Delete(':id')
  @ApiParam({
    name: 'id',
  })
  @UseGuards(AuthGuard('jwtGate'), RoleGuard)
  @CheckRole(RoleName.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
  }
}
