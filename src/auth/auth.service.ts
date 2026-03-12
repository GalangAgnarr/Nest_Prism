import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ================= REGISTER =================
  async register(dto: RegisterDto) {
    // ❌ student tidak boleh register
    if (dto.role === UserRole.STUDENT) {
      throw new ForbiddenException('Student tidak boleh register');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUser) {
      throw new BadRequestException('Username sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        role: dto.role, // ADMIN / PETUGAS
      },
    });

    return {
      message: 'Register berhasil',
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  // ================= LOGIN =================
  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { student: true },
    });

    if (!user) {
      throw new UnauthorizedException('Username tidak ditemukan');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Password salah');
    }

    if (user.role === UserRole.STUDENT && !user.studentId) {
      throw new UnauthorizedException('Akun student belum terhubung');
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      studentId: user.studentId,
    };

    return {
      message: 'Login berhasil',
      access_token: this.jwtService.sign(payload),
    };
  }
}
