import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

export const UserRepository = TypeOrmModule.forFeature([UserEntity]);
