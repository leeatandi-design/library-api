import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.book.findMany({
      include: {
        genre: true,
        reviews: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        genre: true,
        reviews: true,
      },
    });
  }

  create(createBookDto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        title: createBookDto.title,
        author: createBookDto.author,
        isbn: createBookDto.isbn,
        publishedYear: createBookDto.publishedYear,
        genreId: createBookDto.genreId,
        copiesAvailable: createBookDto.copiesAvailable ?? 1,
      },
    });
  }
}
