import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsInt()
  publishedYear: number;

  @IsInt()
  @Min(0)
  totalCopies: number;

  @IsString()
  @IsNotEmpty()
  genreId: string;
}
