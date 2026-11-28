import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.genre.findMany();
  }

  async findOne(id: any) {
    const genre = await this.prisma.genre.findUnique({
      where: { id: String(id) as any },
    });
    if (!genre) {
      throw new NotFoundException(`Genre ${id} not found`);
    }
    return genre;
  }

  create(dto: CreateGenreDto) {
    return this.prisma.genre.create({
      data: dto,
    });
  }

  update(id: any, dto: UpdateGenreDto) {
    return this.prisma.genre.update({
      where: { id: String(id) as any },
      data: dto,
    });
  }

  remove(id: any) {
    return this.prisma.genre.delete({
      where: { id: String(id) as any },
    });
  }
}
