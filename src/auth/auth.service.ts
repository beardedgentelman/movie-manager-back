import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { comparePasswords, encodePassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      const isPasswordValid = comparePasswords(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password!');
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async registration(
    userDto: CreateUserDto,
  ): Promise<{ user: UserEntity; accessToken: string }> {
    try {
      const password = encodePassword(userDto.password);
      const userData = await this.usersService.create({
        ...userDto,
        password,
      });
      const accessToken = this.jwtService.sign({ id: userData.id });

      return { user: userData, accessToken };
    } catch (err) {
      throw err;
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: UserEntity; accessToken: string }> {
    const user = await this.validateUser(email, password);

    const accessToken = this.jwtService.sign({ id: user.id });
    return { user, accessToken };
  }
}
