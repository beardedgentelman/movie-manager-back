import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieEntity } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UserEntity } from '../user/entities/user.entity';
import { FileService } from '../aws-s3/file.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    private readonly fileService: FileService,
  ) {}

  async findAll(): Promise<MovieEntity[]> {
    try {
      return this.movieRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async getMovie(userId: number, movieId: number): Promise<MovieEntity> {
    const movie = await this.movieRepository.findOne({
      where: { id: movieId, user: { id: userId } },
    });

    if (!movie) throw new NotFoundException('Movie not found or access denied');

    return movie;
  }

  async create(movieDto: CreateMovieDto, userId: number): Promise<MovieEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const movie = this.movieRepository.create({ ...movieDto, user });
    return await this.movieRepository.save(movie);
  }

  async getUserMovies(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ movies: MovieEntity[]; total: number }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['movies'],
    });
    if (!user) throw new NotFoundException('User not found');

    const [movies, total] = await this.movieRepository.findAndCount({
      where: { user },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { movies, total };
  }

  async uploadPoster(file: Express.Multer.File, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const fileName = `${userId}-${Date.now()}-${file.originalname}`;
    const s3Url = await this.fileService.uploadFile(file, fileName);

    return { message: 'Poster uploaded successfully', s3Url };
  }

  async deleteUserMovie(userId: number, movieId: number): Promise<void> {
    const movie = await this.movieRepository.findOne({
      where: { id: movieId, user: { id: userId } },
    });

    if (!movie) throw new NotFoundException('Movie not found or access denied');

    await this.movieRepository.remove(movie);
  }
}
