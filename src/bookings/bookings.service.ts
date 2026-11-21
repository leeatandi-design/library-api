import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createDto: CreateBookingDto) {
    const space = await this.prisma.space.findUnique({
      where: { id: createDto.spaceId },
    });

    if (!space) {
      throw new NotFoundException(`Space with ID "${createDto.spaceId}" not found`);
    }

    const startTime = new Date(createDto.startTime);
    const endTime = new Date(createDto.endTime);
    const date = new Date(createDto.date);

    if (endTime <= startTime) {
      throw new BadRequestException('End time must be after start time');
    }

    // Server-side conflict check via Prisma findFirst
    // A booking overlaps if: existing.startTime < new.endTime AND existing.endTime > new.startTime
    const overlapping = await this.prisma.booking.findFirst({
      where: {
        spaceId: createDto.spaceId,
        status: { not: BookingStatus.CANCELLED },
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } },
        ],
      },
    });

    if (overlapping) {
      throw new ConflictException(
        `Space "${space.name}" is already booked during this time interval. Please choose another time slot.`,
      );
    }

    return this.prisma.booking.create({
      data: {
        userId,
        spaceId: createDto.spaceId,
        date,
        startTime,
        endTime,
        status: BookingStatus.CONFIRMED,
      },
      include: {
        space: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  findAll(query?: { spaceId?: string; userId?: string }) {
    const where: any = {};
    if (query?.spaceId) where.spaceId = query.spaceId;
    if (query?.userId) where.userId = query.userId;

    return this.prisma.booking.findMany({
      where,
      include: {
        space: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        space: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }

    return booking;
  }

  async cancel(id: string, userId: string, isLibrarian: boolean = false) {
    const booking = await this.findOne(id);

    if (!isLibrarian && booking.userId !== userId) {
      throw new BadRequestException('You are not authorized to cancel this booking');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
      include: { space: true },
    });
  }
}
