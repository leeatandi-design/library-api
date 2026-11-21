import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { UpdateBorrowRequestDto } from './dto/update-borrow-request.dto';
import { calculateFine } from './fine-calculator';
import { BorrowStatus } from '@prisma/client';

@Injectable()
export class BorrowRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createDto: CreateBorrowRequestDto) {
    const book = await this.prisma.book.findUnique({
      where: { id: createDto.bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID "${createDto.bookId}" not found`);
    }

    if (book.totalCopies <= 0) {
      throw new BadRequestException('This book is currently out of stock');
    }

    const borrowDate = createDto.borrowDate ? new Date(createDto.borrowDate) : new Date();
    const dueDate = new Date(createDto.dueDate);

    if (dueDate <= borrowDate) {
      throw new BadRequestException('Due date must be after borrow date');
    }

    return this.prisma.borrowRequest.create({
      data: {
        userId,
        bookId: createDto.bookId,
        borrowDate,
        dueDate,
        status: BorrowStatus.PENDING,
      },
      include: {
        book: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  findAll(query?: { status?: BorrowStatus; userId?: string }) {
    const where: any = {};
    if (query?.status) where.status = query.status;
    if (query?.userId) where.userId = query.userId;

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

  async findOne(id: string) {
    const request = await this.prisma.borrowRequest.findUnique({
      where: { id },
      include: {
        book: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!request) {
      throw new NotFoundException(`Borrow request with ID "${id}" not found`);
    }

    return request;
  }

  async update(id: string, updateDto: UpdateBorrowRequestDto) {
    const existing = await this.findOne(id);

    const data: any = {};

    if (updateDto.status) {
      data.status = updateDto.status;
    }

    if (updateDto.status === BorrowStatus.RETURNED || updateDto.returnDate) {
      const returnDate = updateDto.returnDate ? new Date(updateDto.returnDate) : new Date();
      data.returnDate = returnDate;

      // Automatically calculate fines for late returns
      const rate = updateDto.ratePerDay ?? 1.5;
      data.fineAmount = calculateFine(existing.dueDate, returnDate, rate);
    }

    return this.prisma.borrowRequest.update({
      where: { id },
      data,
      include: {
        book: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }
}
