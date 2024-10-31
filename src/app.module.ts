import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from './db/typeorm.module';
import { UserModule } from './user/user.module';
import { UserRepository } from './user/user.repository';
import { MovieModule } from './movie/movie.module';
import { UploadModule } from './aws-s3/upload.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule,
    MovieModule,
    UploadModule,
    UserModule,
    UserRepository,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
