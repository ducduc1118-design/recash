import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { formatCurrency } from '../../common/utils/format';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const entries = await this.prisma.ledger.findMany({ where: { userId } });
    const lifetime = entries.reduce((sum, entry) => {
      if (entry.type === 'earning' || entry.type === 'bonus') {
        return sum + entry.amount;
      }
      return sum;
    }, 0);

    const pending = entries.reduce((sum, entry) => {
      return entry.status === 'pending' ? sum + entry.amount : sum;
    }, 0);

    const withdrawals = entries.reduce((sum, entry) => {
      return entry.type === 'withdrawal' ? sum + entry.amount : sum;
    }, 0);

    const balance = lifetime - withdrawals;

    return {
      balance: formatCurrency(balance),
      pending: formatCurrency(pending),
      lifetime: formatCurrency(lifetime),
    };
  }

  async getLedger(userId: string) {
    return this.prisma.ledger.findMany({ where: { userId }, orderBy: { date: 'desc' } });
  }
}
