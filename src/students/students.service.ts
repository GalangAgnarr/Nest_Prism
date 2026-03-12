import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateStudentDto) {
        return this.prisma.student.create({ data: dto });
    }

    async findAll(filters?: { nis?: string; name?: string }) {
        const { nis, name } = filters ?? {};

        return this.prisma.student.findMany({
            where: {
                ...(nis ? { nis } : {}),
                ...(name ? { name: { contains: name } } : {}),
            },
            orderBy: { id: 'desc' },
        });
    }

    async findOne(id: number) {
        const student = await this.prisma.student.findUnique({ where: { id } });
        if (!student) throw new NotFoundException('Student not found');
        return student;
    }

    async update(id: number, dto: UpdateStudentDto) {
        // pastikan ada dulu
        await this.findOne(id);
        return this.prisma.student.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: number) {
        // pastikan ada dulu
        await this.findOne(id);
        return this.prisma.student.delete({ where: { id } });
    }
}
