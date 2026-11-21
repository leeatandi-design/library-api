import { IsString, IsNotEmpty, IsInt, IsOptional, Min } from 'class-validator';

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

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsInt()
  publishedYear?: number;

  @IsInt()
  @Min(1)
  totalCopies: number;

  @IsNotEmpty()
  genreId: any;
}
