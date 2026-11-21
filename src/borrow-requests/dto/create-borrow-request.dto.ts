import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateBorrowRequestDto {
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @IsDateString()
  @IsOptional()
  borrowDate?: string;
}
