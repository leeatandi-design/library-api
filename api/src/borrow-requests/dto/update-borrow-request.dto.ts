import { IsEnum, IsOptional, IsDateString, IsNumber, Min } from 'class-validator';
import { BorrowStatus } from '@prisma/client';

export class UpdateBorrowRequestDto {
  @IsEnum(BorrowStatus)
  @IsOptional()
  status?: BorrowStatus;

  @IsDateString()
  @IsOptional()
  returnDate?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  ratePerDay?: number;
}
