import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserRepository],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
