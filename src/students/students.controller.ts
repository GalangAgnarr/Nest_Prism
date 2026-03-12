import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Students')
@ApiBearerAuth()
@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Post()
    @ApiOperation({ summary: 'Menambahkan data siswa (ADMIN only)' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreateStudentDto) {
        return this.studentsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Menampilkan daftar siswa dengan filter nis/name' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.PETUGAS)
    findAll(@Query('nis') nis?: string, @Query('name') name?: string) {
        return this.studentsService.findAll({ nis, name });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Menampilkan detail siswa berdasarkan ID' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.PETUGAS)
    findOne(@Param('id') id: string) {
        return this.studentsService.findOne(Number(id));
    }

    @Put(':id')
    @ApiOperation({ summary: 'Memperbarui data siswa (ADMIN only)' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
        return this.studentsService.update(Number(id), dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Menghapus data siswa (ADMIN only)' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.studentsService.remove(Number(id));
    }
}
