import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ContributionService } from '../contribution.service';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { RoleGuard } from 'src/role/role.guard';
import { CheckRole } from 'src/role/role.decorator';
import { RoleName } from 'src/role/entity/role.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateContributionRequest } from '../dtos/create.contribution.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { ApiParam } from '@nestjs/swagger';
import { UpdateContributionRequest } from '../dtos/update.contribution.dto';

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

  @Patch('/approve/:id')
  @ApiParam({
    name: 'id',
  })
  @UseGuards(AuthGuardJwt, RoleGuard)
  @CheckRole(RoleName.MARKETING_COORDINATOR)
  async approveSubmission(@Param('id') id) {
    const contribution =
      await this.contributionService.getContributionDetail(id);
    return await this.contributionService.approveContribution(contribution);
  }
}
