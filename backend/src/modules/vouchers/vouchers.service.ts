import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VouchersService {
  constructor(private prisma: PrismaService) {}

  list(filters: { search?: string; category?: string; type?: string }) {
    const where: any = {};
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.type) {
      where.type = filters.type;
    }

    return this.prisma.voucher.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  getById(id: string) {
    return this.prisma.voucher.findUnique({ where: { id } });
  }
}
