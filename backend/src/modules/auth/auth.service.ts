import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(payload: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new ConflictException('Email already exists');
    }
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: payload.email,
        passwordHash,
        name: payload.name,
        role: Role.user,
      },
    });
    return this.issueToken(user);
  }

  async login(payload: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issueToken(user);
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;
    return this.mapUser(user);
  }

  async updateMe(userId: string, payload: UpdateMeDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: payload,
    });
    return this.mapUser(user);
  }

  private issueToken(user: { id: string; email: string; role: Role }) {
    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return {
      token,
      user: this.mapUser(user),
    };
  }

  private mapUser(user: { id: string; email: string; role: Role; name?: string; phone?: string | null; avatarUrl?: string | null }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name || 'User',
      phone: user.phone || undefined,
      avatarUrl: user.avatarUrl || 'https://i.pravatar.cc/150?img=5',
      role: user.role,
    };
  }
}
