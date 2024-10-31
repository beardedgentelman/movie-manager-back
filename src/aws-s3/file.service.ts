import { Injectable } from '@nestjs/common';
import { AWSS3Service } from './aws-s3.service';

@Injectable()
export class FileService {
  constructor(private readonly s3: AWSS3Service) {}

  async uploadFile(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<string> {
    const s3Path = `posters/${fileName}`;
    const fileBuffer = file.buffer;

    const result = await this.s3.putObject(fileBuffer, s3Path);
    return result.Location;
  }
}
