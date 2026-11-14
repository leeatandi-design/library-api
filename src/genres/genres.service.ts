import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  create(_createGenreDto: CreateGenreDto) {
    return 'This action adds a new genre';
  }

  findAll() {
    return this.prisma.genre.findMany({
      include: {
        books: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.genre.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });
  }

  update(id: string, _updateGenreDto: UpdateGenreDto) {
    return `This action updates a #${id} genre`;
  }

  remove(id: string) {
    return this.prisma.genre.delete({
      where: { id },
    });
  }
}
