import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Loans')
@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  // ===============================
  // 📌 ADMIN & PETUGAS (WAJIB TOKEN)
  // ===============================

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Membuat transaksi peminjaman (ADMIN/PETUGAS only)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  create(@Body() createLoanDto: CreateLoanDto) {
    return this.loanService.create(createLoanDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Menampilkan seluruh transaksi peminjaman (ADMIN/PETUGAS only)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  findAll() {
    return this.loanService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Menampilkan detail transaksi peminjaman berdasarkan ID' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  findOne(@Param('id') id: string) {
    return this.loanService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Memperbarui transaksi peminjaman (ADMIN/PETUGAS only)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  update(
    @Param('id') id: string,
    @Body() updateLoanDto: UpdateLoanDto,
  ) {
    return this.loanService.update(+id, updateLoanDto);
  }

  // ===============================
  // 📌 STUDENT (TANPA TOKEN)
  // ===============================

  @Post('student')
  @ApiOperation({ summary: 'Peminjaman buku oleh siswa (tanpa token)' })
  borrowByStudent(@Body() dto: CreateLoanDto) {
    return this.loanService.createByStudent(dto.studentId, dto);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Riwayat peminjaman berdasarkan studentId (tanpa token)' })
  myHistory(@Param('studentId') studentId: string) {
    return this.loanService.findByStudent(+studentId);
  }

  // ===============================
  // 📌 PENGEMBALIAN
  // ===============================

  @Patch(':id/return')
  @ApiOperation({ summary: 'Mengembalikan buku (tanpa token)' })
  returnBook(@Param('id') id: string) {
    return this.loanService.returnBook(+id);
  }

  // ===============================
  // 📌 ADMIN ONLY
  // ===============================

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Menghapus transaksi peminjaman (ADMIN only)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.loanService.remove(+id);
  }
}
