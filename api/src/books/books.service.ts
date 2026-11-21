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

  async findOne(id: string | number) {
    const book = await this.prisma.book.findUnique({
      where: { id: String(id) },
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

  async update(id: string | number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    const data: any = Object.assign({}, updateBookDto);
    if (data.genreId !== undefined) {
      data.genreId = String(data.genreId);
    }

    return this.prisma.book.update({
      where: { id: String(id) },
      data,
      include: {
        genre: true,
      },
    });
  }

  async remove(id: string | number) {
    await this.findOne(id);

    return this.prisma.book.delete({
      where: { id: String(id) },
    });
  }
}
