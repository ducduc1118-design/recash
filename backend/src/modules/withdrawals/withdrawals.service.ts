import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';

@Injectable()
export class WithdrawalsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, payload: CreateWithdrawalDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const details = payload.method === 'bank' ? 'Bank Transfer' : 'E-Wallet';
    return this.prisma.withdrawal.create({
      data: {
        userId,
        user: user?.name || 'User',
        method: payload.method,
        details,
        amount: payload.amount,
      },
    });
  }

  list(userId: string) {
    return this.prisma.withdrawal.findMany({ where: { userId }, orderBy: { date: 'desc' } });
  }
}
