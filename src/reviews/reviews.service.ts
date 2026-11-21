import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  create(_createReviewDto: CreateReviewDto) {
    return 'This action adds a new review';
  }

  findAll() {
    return this.prisma.review.findMany({
      include: {
        book: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.review.findUnique({
      where: { id },
      include: {
        book: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  update(id: string, _updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: string) {
    return this.prisma.review.delete({
      where: { id },
    });
  }
}
