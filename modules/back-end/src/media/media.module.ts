import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { MediaController } from './controllers/media.controller';

@Module({
  providers: [MediaService],
  exports: [MediaService],
  controllers: [MediaController],
  imports: [FirebaseModule],
})
export class MediaModule {}
