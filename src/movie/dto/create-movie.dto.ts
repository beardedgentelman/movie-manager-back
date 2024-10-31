import { IsNotEmpty, IsString, IsUrl, Max, Min } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @Min(1888)
  @Max(new Date().getFullYear())
  publishing_year: number;

  @IsNotEmpty()
  @IsUrl()
  poster: string;
}
