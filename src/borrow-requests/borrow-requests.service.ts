import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { calculateFine } from './fine-calculator';

@Injectable()
export class BorrowRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: any, dto: CreateBorrowRequestDto) {
    const book = await this.prisma.book.findUnique({
      where: { id: String(dto.bookId) },
    });
    if (!book) throw new NotFoundException('Book not found');

    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    return this.prisma.borrowRequest.create({
      data: {
        userId: String(userId),
        bookId: book.id,
        dueDate,
      },
      include: {
        book: true,
      },
    });
  }

  findAll(query?: { status?: any; userId?: any }) {
    const where: any = {};
    if (query?.status) where.status = query.status;
    if (query?.userId) where.userId = String(query.userId);

    return this.prisma.borrowRequest.findMany({
      where,
      include: {
        book: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: any) {
    const request = await this.prisma.borrowRequest.findUnique({
      where: { id: String(id) },
      include: {
        book: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!request) throw new NotFoundException('Request not found');
    return request;
  }

  async updateStatus(id: any, status: string) {
    const request = await this.findOne(id);

    const data: any = { status };
    if (status === 'RETURNED') {
      const now = new Date();
      data.returnDate = now;
      data.fineAmount = calculateFine(request.dueDate, now);
    }
    return this.prisma.borrowRequest.update({
      where: { id: String(id) },
      data,
      include: { book: true },
    });
  }

  update(id: any, dto: any) {
    const status = dto.status || dto;
    return this.updateStatus(id, status);
  }
}
