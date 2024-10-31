import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(userDto: CreateUserDto): Promise<UserEntity> {
    try {
      const email = userDto.email;
      const userEmail = await this.userRepository.findOneBy({
        email,
      });

      if (userEmail) {
        throw new ConflictException('User with this email is already exist!');
      }
      const newUser = await this.userRepository.save(userDto);
      return await this.userRepository.findOneBy({ id: newUser.id });
    } catch (e) {
      throw e;
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      return this.userRepository.find();
    } catch (e) {
      throw e;
    }
  }

  async getUser(id: number): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id },
        relations: ['movies'],
      });
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      return user;
    } catch (e) {
      throw e;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      await this.userRepository.remove(user);
    } catch (e) {
      throw e;
    }
  }
}
