import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';

export const MovieRepository = TypeOrmModule.forFeature([MovieEntity]);
