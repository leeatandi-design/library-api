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
import { BorrowRequestsService } from './borrow-requests.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('borrow-requests')
export class BorrowRequestsController {
  constructor(private service: BorrowRequestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() dto: CreateBorrowRequestDto) {
    const userId = req.user?.userId || req.user?.id || req.user?.sub;
    return this.service.create(userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any, @Query('status') status?: any, @Query('userId') userId?: any) {
    const user = req.user;
    const targetUserId = user?.role === 'LIBRARIAN' ? userId : (user?.userId || user?.id);
    return this.service.findAll({ status, userId: targetUserId });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  updateStatus(
    @Param('id') id: string,
    @Body('status') statusPayload?: string,
    @Body() fullBody?: any,
  ) {
    const status = statusPayload || fullBody?.status;
    return this.service.updateStatus(id, status);
  }
}
