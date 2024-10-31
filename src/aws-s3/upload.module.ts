import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { AWSS3Service } from './aws-s3.service';

@Module({
  imports: [],
  controllers: [],
  providers: [FileService, AWSS3Service],
})
export class UploadModule {}
