import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoanService {
  constructor(private prisma: PrismaService) {}

  private async ensureBookAvailable(bookId: number) {
    const activeLoan = await this.prisma.loan.findFirst({
      where: {
        bookId,
        returnDate: null,
      },
      select: { id: true },
    });

    if (activeLoan) {
      throw new BadRequestException('Book is currently borrowed');
    }
  }

  async create(createLoanDto: CreateLoanDto) {
    const bookId = Number(createLoanDto.bookId);
    await this.ensureBookAvailable(bookId);

    return this.prisma.loan.create({
      data: {
        studentId: Number(createLoanDto.studentId),
        bookId,
        dueDate: new Date(String(createLoanDto.dueDate)),
      },
      include: {
        student: true,
        book: true,
      },
    });
  }

  async findAll() {
    return this.prisma.loan.findMany({
      include: {
        student: true,
        book: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: {
        student: true,
        book: true,
      },
    });

    if (!loan) throw new NotFoundException('Loan not found');
    return loan;
  }

  async findByStudent(studentId: number) {
    return this.prisma.loan.findMany({
      where: { studentId },
      include: {
        book: true,
      },
      orderBy: {
        loanDate: 'desc',
      },
    });
  }

  async createByStudent(studentId: number, createLoanDto: CreateLoanDto) {
    const bookId = Number(createLoanDto.bookId);
    await this.ensureBookAvailable(bookId);

    return this.prisma.loan.create({
      data: {
        studentId,
        bookId,
        dueDate: new Date(String(createLoanDto.dueDate)),
      },
      include: {
        student: true,
        book: true,
      },
    });
  }

  async returnBook(id: number) {
    const loan = await this.prisma.loan.findUnique({ where: { id } });

    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.returnDate)
      throw new BadRequestException('Book already returned');

    return this.prisma.loan.update({
      where: { id },
      data: {
        returnDate: new Date(),
      },
      include: {
        student: true,
        book: true,
      },
    });
  }

  async update(id: number, updateLoanDto: UpdateLoanDto) {
    await this.findOne(id);
    return this.prisma.loan.update({
      where: { id },
      data: updateLoanDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.loan.delete({ where: { id } });

    return {
      message: `Loan ${id} deleted`,
    };
  }
}
