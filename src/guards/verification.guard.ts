import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class VerificationGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request.user;

    if (!id) {
      return false;
    }

    try {
      const foundUser = await this.userRepository.findOneBy({ id: id });
      if (foundUser) {
        return true;
      } else {
        throw new ForbiddenException('Email is not verified');
      }
    } catch (error) {
      throw new ForbiddenException('Email is not verified');
    }
  }
}
