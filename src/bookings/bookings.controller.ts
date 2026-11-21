import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Req() req: Request, @Body() createDto: CreateBookingDto) {
    const user = (req as any).user;
    return this.bookingsService.create(user.id, createDto);
  }

  @Get()
  findAll(
    @Req() req: Request,
    @Query('spaceId') spaceId?: string,
    @Query('userId') userId?: string,
  ) {
    const user = (req as any).user;
    // Patrons only see their own bookings; librarians can inspect all bookings (Admin route)
    const targetUserId = user.role === 'LIBRARIAN' ? userId : user.id;
    return this.bookingsService.findAll({ spaceId, userId: targetUserId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/cancel')
  cancel(@Req() req: Request, @Param('id') id: string) {
    const user = (req as any).user;
    return this.bookingsService.cancel(id, user.id, user.role === 'LIBRARIAN');
  }
}
