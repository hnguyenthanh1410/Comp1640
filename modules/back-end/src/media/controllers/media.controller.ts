import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from '../media.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const data = Promise.all(
      files.map(async (file) => await this.mediaService.upload(file)),
    );
    return data;
  }
}
