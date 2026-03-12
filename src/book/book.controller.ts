import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Books')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Menambahkan buku (ADMIN/PETUGAS only)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Menampilkan seluruh data buku' })
  findAll() {
    return this.bookService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Mencari buku berdasarkan title/author' })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'author', required: false, type: String })
  search(@Query('title') title?: string, @Query('author') author?: string) {
    return this.bookService.findFiltered(title, author);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Menampilkan detail buku berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Memperbarui data buku (ADMIN/PETUGAS only)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Menghapus buku (ADMIN/PETUGAS only)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
