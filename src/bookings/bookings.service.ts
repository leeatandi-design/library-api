import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: any, dto: CreateBookingDto) {
    const conflict = await this.prisma.booking.findFirst({
      where: {
        spaceId: dto.spaceId as any,
        date: dto.date as any,
        status: 'CONFIRMED' as any,
        startTime: { lt: dto.endTime } as any,
        endTime: { gt: dto.startTime } as any,
      },
    });

    if (conflict) {
      throw new ConflictException('This space is already booked for that time');
    }

    return this.prisma.booking.create({
      data: {
        ...dto,
        userId: userId as any,
      } as any,
    });
  }

  findAll(query?: { spaceId?: any; userId?: any }) {
    const where: any = {};
    if (query?.spaceId) where.spaceId = String(query.spaceId);
    if (query?.userId) where.userId = String(query.userId);

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

  async findOne(id: any) {
    return this.prisma.booking.findUnique({
      where: { id: String(id) },
      include: {
        space: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  async cancel(id: any, userId: any, isLibrarian: boolean = false) {
    const booking = await this.findOne(id);
    if (!booking) return null;
    if (!isLibrarian && booking.userId !== String(userId)) {
      return null;
    }
    return this.prisma.booking.update({
      where: { id: String(id) },
      data: { status: 'CANCELLED' },
      include: { space: true },
    });
  }
}
