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
import { UpdateBorrowRequestDto } from './dto/update-borrow-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BorrowStatus } from '@prisma/client';
import type { Request } from 'express';

@Controller('borrow-requests')
@UseGuards(JwtAuthGuard)
export class BorrowRequestsController {
  constructor(private readonly borrowRequestsService: BorrowRequestsService) {}

  @Post()
  create(@Req() req: Request, @Body() createDto: CreateBorrowRequestDto) {
    const user = (req as any).user;
    return this.borrowRequestsService.create(user.id, createDto);
  }

  @Get()
  findAll(
    @Req() req: Request,
    @Query('status') status?: BorrowStatus,
    @Query('userId') userId?: string,
  ) {
    const user = (req as any).user;
    // Patrons only see their own requests; librarians can see all or filter by user
    const targetUserId = user.role === 'LIBRARIAN' ? userId : user.id;
    return this.borrowRequestsService.findAll({ status, userId: targetUserId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowRequestsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('LIBRARIAN')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateBorrowRequestDto,
  ) {
    return this.borrowRequestsService.update(id, updateDto);
  }
}
