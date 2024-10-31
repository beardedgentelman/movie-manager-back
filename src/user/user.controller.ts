import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { VerificationGuard } from '../guards/verification.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, VerificationGuard)
  @Get('get-all')
  async getAll() {
    return await this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, VerificationGuard)
  @Get('get-user')
  async getUser(@Request() request) {
    const { user } = request;

    return await this.userService.getUser(+user);
  }

  @UseGuards(JwtAuthGuard, VerificationGuard)
  @Delete(':id')
  async delete(@Param('id') userId: number) {
    return await this.userService.delete(userId);
  }
}
