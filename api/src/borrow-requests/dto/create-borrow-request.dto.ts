import { IsNotEmpty } from 'class-validator';

export class CreateBorrowRequestDto {
  @IsNotEmpty()
  bookId: any;
}
