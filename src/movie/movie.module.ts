import { Module } from '@nestjs/common';
import { MovieRepository } from './movie.repository';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { UserRepository } from '../user/user.repository';
import { FileService } from '../aws-s3/file.service';
import { AWSS3Service } from '../aws-s3/aws-s3.service';

@Module({
  imports: [MovieRepository, UserRepository],
  controllers: [MovieController],
  providers: [MovieService, FileService, AWSS3Service],
  exports: [MovieService, MovieRepository],
})
export class MovieModule {}
