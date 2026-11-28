import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { calculateFine } from './fine-calculator';

@Injectable()
export class BorrowRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: any, dto: CreateBorrowRequestDto) {
    const book = await this.prisma.book.findUnique({
      where: { id: String(dto.bookId) as any },
    });
    if (!book) throw new NotFoundException('Book not found');

    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    return this.prisma.borrowRequest.create({
      data: {
        userId: String(userId),
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        dueDate,
      } as any,
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
    const request = await this.prisma.borrowRequest.findUnique({
      where: { id: String(id) as any },
    });
    if (!request) throw new NotFoundException('Request not found');

    const data: any = { status };
    if (status === 'RETURNED') {
      const now = new Date();
      data.returnDate = now;
      data.fineAmount = request.dueDate ? calculateFine(request.dueDate, now) : 0;
    }
    return this.prisma.borrowRequest.update({
      where: { id: String(id) as any },
      data,
      include: { book: true },
    });
  }

  update(id: any, dto: any) {
    const status = dto.status || dto;
    return this.updateStatus(id, status);
  }
}
