import { IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  spaceId: any;

  @IsNotEmpty()
  date: any;

  @IsNotEmpty()
  startTime: any;

  @IsNotEmpty()
  endTime: any;
}
