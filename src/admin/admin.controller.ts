import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BorrowRequestsService } from '../borrow-requests/borrow-requests.service';
import { BookingsService } from '../bookings/bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('LIBRARIAN')
export class AdminController {
  constructor(
    private readonly borrowRequestsService: BorrowRequestsService,
    private readonly bookingsService: BookingsService,
  ) {}

  @Get('borrow-requests')
  getBorrowRequests() {
    return this.borrowRequestsService.findAll();
  }

  @Patch('borrow-requests/:id')
  updateBorrowRequestStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.borrowRequestsService.updateStatus(
      isNaN(Number(id)) ? id : Number(id),
      status,
    );
  }

  @Get('bookings')
  getBookings() {
    return this.bookingsService.findAll();
  }
}
