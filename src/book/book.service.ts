import { Injectable, NotFoundException } from
  '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) { }

  private mapBookStatus(
    book: {
      loans: Array<{ id: number }>;
      [key: string]: any;
    },
  ) {
    const { loans, ...bookData } = book;

    return {
      ...bookData,
      status: loans.length > 0 ? 'BORROWED' : 'AVAILABLE',
    };
  }

  async create(dto: CreateBookDto) {
    return this.prisma.book.create({ data: dto });
  }
  async findAll() {
    const books = await this.prisma.book.findMany({
      include: {
        loans: {
          where: { returnDate: null },
          select: { id: true },
          take: 1,
        },
      },
      orderBy: { id: 'asc' },
    });

    return books.map((book) => this.mapBookStatus(book));
  }

  async findFiltered(title?: string, author?: string) {
    const books = await this.prisma.book.findMany({
      where: {
        ...(title ? { title: { contains: title } } : {}),
        ...(author ? { author: { contains: author } } : {}),
      },
      include: {
        loans: {
          where: { returnDate: null },
          select: { id: true },
          take: 1,
        },
      },
      orderBy: { id: 'asc' },
    });

    return books.map((book) => this.mapBookStatus(book));
  }


  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        loans: {
          where: { returnDate: null },
          select: { id: true },
          take: 1,
        },
      },
    });

    if (!book) throw new NotFoundException('Book not found');

    return this.mapBookStatus(book);
  }
  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id);
    return this.prisma.book.update({
      where: { id },
      data: dto,
    });
  }
  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.book.delete({ where: { id } });
    return { message: `Book with id ${id} deleted` };
  }
}
