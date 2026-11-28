import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(genreId?: string, search?: string, page: number = 1, limit: number = 20) {
    const where: any = {};

    if (genreId !== undefined && genreId !== '') {
      where.genreId = String(genreId);
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.book.findMany({
      where,
      include: {
        genre: true,
      },
      skip: (page - 1) * limit,
      take: Number(limit),
    });
  }

  async findOne(id: any) {
    const book = await this.prisma.book.findUnique({
      where: { id: String(id) as any },
      include: {
        genre: true,
      },
    });

    if (!book) {
      throw new NotFoundException(`Book ${id} not found`);
    }

    return book;
  }

  create(createBookDto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        title: createBookDto.title,
        author: createBookDto.author,
        isbn: createBookDto.isbn,
        publishedYear: createBookDto.publishedYear ?? new Date().getFullYear(),
        totalCopies: createBookDto.totalCopies ?? 1,
        genreId: String(createBookDto.genreId),
      },
      include: {
        genre: true,
      },
    });
  }

  update(id: any, updateBookDto: UpdateBookDto) {
    const data: any = Object.assign({}, updateBookDto);
    if (data.genreId !== undefined) {
      data.genreId = String(data.genreId);
    }

    return this.prisma.book.update({
      where: { id: String(id) as any },
      data,
      include: {
        genre: true,
      },
    });
  }

  remove(id: any) {
    return this.prisma.book.delete({
      where: { id: String(id) as any },
    });
  }
}
