import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { VerificationGuard } from '../guards/verification.guard';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieEntity } from './entities/movie.entity';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @UseGuards(JwtAuthGuard, VerificationGuard)
  @Get('get-all')
  async getAll() {
    return await this.movieService.findAll();
  }

  @UseGuards(JwtAuthGuard, VerificationGuard)
  @Get('user-movies')
  async getUserMovies(
    @Request() request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { user } = request;
    return await this.movieService.getUserMovies(user, page, limit);
  }

  @UseGuards(JwtAuthGuard, VerificationGuard)
  @Post('create')
  async createMovie(
    @Body() createMovieDto: CreateMovieDto,
    @Request() request,
  ) {
    const { user } = request;
    return await this.movieService.create(createMovieDto, user);
  }

  @UseGuards(JwtAuthGuard, VerificationGuard)
  @Post('upload-poster')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPosterMovie(
    @UploadedFile() file: Express.Multer.File,
    @Request() request,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
      );
    }

    const { user } = request;
    return await this.movieService.uploadPoster(file, user);
  }

  @UseGuards(JwtAuthGuard, VerificationGuard)
  @Get(':id')
  async getMovie(
    @Request() request,
    @Param('id') movieId: number,
  ): Promise<MovieEntity> {
    const { user } = request;
    return await this.movieService.getMovie(user, +movieId);
  }

  @UseGuards(JwtAuthGuard, VerificationGuard)
  @Delete(':id')
  async deleteMovie(@Param('id') movieId: number, @Request() request) {
    const { user } = request;
    return await this.movieService.deleteUserMovie(user, movieId);
  }
}
