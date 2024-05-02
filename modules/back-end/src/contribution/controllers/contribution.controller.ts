import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ContributionService } from '../contribution.service';
import { AuthGuardJwt } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { CheckRole } from 'src/role/role.decorator';
import { RoleName } from 'src/role/entity/role.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateContributionRequest } from '../dtos/create.contribution.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { ApiParam } from '@nestjs/swagger';
import { UpdateContributionRequest } from '../dtos/update.contribution.dto';
import { UpdateStatusRequest } from '../dtos/update.status.contribution.dto';
import { deleteContributionRequest } from '../dtos/delete.contribution.dto';

@Controller('contribution')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @Get('not-approved-contribution-list')
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(RoleName.MARKETING_COORDINATOR)
  async getNotApprovedContributionList() {
    return await this.contributionService.getNotApprovedContributionList();
  }

  @Get('approved-contribution-list')
  @UseGuards(AuthGuardJwt)
  async getApprovedContributionList() {
    return await this.contributionService.getApprovedContributionList();
  }

  @Get('approved-contribution-list/:id')
  @ApiParam({
    name: 'id',
  })
  async getApprovedContributionListOfFaculty(@Param('id') id) {
    return await this.contributionService.getApprovedContributionListWithFaculty(
      id,
    );
  }

  @Get('contribution-list/:id')
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(
    RoleName.MARKETING_COORDINATOR,
    RoleName.STUDENT,
    RoleName.MARKETING_MANAGER,
  )
  @ApiParam({
    name: 'id',
  })
  async getAllContributionListOfFaculty(@Param('id') id) {
    return await this.contributionService.getAllContributionListWithFaculty(id);
  }

  @Get('contribution-list/')
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(
    RoleName.MARKETING_COORDINATOR,
    RoleName.STUDENT,
    RoleName.MARKETING_MANAGER,
  )
  async getAllContributionList() {
    return await this.contributionService.getAllContributionList();
  }

  @Post('create')
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(RoleName.STUDENT)
  @UseInterceptors(FilesInterceptor('files'))
  async createContribution(
    @Body() payload: CreateContributionRequest,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: User,
  ) {
    return await this.contributionService.createContribution(
      payload,
      files,
      user,
    );
  }

  @Get('/detail/:id')
  @ApiParam({
    name: 'id',
  })
  async getSubmissionDetail(@Param('id') id) {
    return await this.contributionService.getContributionDetail(id);
  }

  @Patch('/update/:id')
  @ApiParam({
    name: 'id',
  })
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(RoleName.STUDENT)
  @UseInterceptors(FilesInterceptor('files'))
  async updateSubmission(
    @Param('id') id,
    @Body() payload: UpdateContributionRequest,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: User,
  ) {
    const contribution =
      await this.contributionService.getContributionDetail(id);
    return await this.contributionService.updateContribution(
      payload,
      files,
      user,
      contribution,
    );
  }

  @Patch('/set-status/:id')
  @ApiParam({
    name: 'id',
  })
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(RoleName.MARKETING_COORDINATOR)
  async setStatusOrApproveIfNoStatusPassed(
    @Param('id') id,
    @Body() payload: UpdateStatusRequest,
  ) {
    const contribution =
      await this.contributionService.getContributionDetail(id);
    return await this.contributionService.setStatus(contribution, payload);
  }

  @Delete('/delete')
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(
	RoleName.MARKETING_MANAGER,
	RoleName.ADMIN
  )
  async deleteContribution (@Body() payload: deleteContributionRequest) {
	await this.contributionService.deleteContribution(payload )
  }

  @Get('/count')
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(RoleName.ADMIN)
  async countContribution () {
	return await this.contributionService.countContribution();
  }

  @Get('/count-contribution-per-user')
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(RoleName.ADMIN)
  async countContributionPerUser () {
	return await this.contributionService.countPostPerUser();
  }
}
