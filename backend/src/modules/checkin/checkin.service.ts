import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const yesterday = (date: Date) => {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d;
};

@Injectable()
export class CheckinService {
  constructor(private prisma: PrismaService) {}

  async getStatus(userId: string) {
    const entries = await this.prisma.ledger.findMany({
      where: { userId, type: 'bonus', title: 'Daily Check-in' },
      orderBy: { date: 'desc' },
    });

    if (entries.length === 0) {
      return { streak: 0, checkedIn: false };
    }

    const today = new Date();
    const checkedIn = sameDay(entries[0].date, today);

    let streak = 0;
    let cursor = today;
    for (const entry of entries) {
      if (sameDay(entry.date, cursor)) {
        streak += 1;
        cursor = yesterday(cursor);
        continue;
      }
      if (sameDay(entry.date, yesterday(cursor))) {
        streak += 1;
        cursor = yesterday(cursor);
        continue;
      }
      break;
    }

    return { streak, checkedIn };
  }

  async checkinToday(userId: string) {
    const today = new Date();
    const existing = await this.prisma.ledger.findFirst({
      where: { userId, type: 'bonus', title: 'Daily Check-in' },
      orderBy: { date: 'desc' },
    });

    if (existing && sameDay(existing.date, today)) {
      return this.getStatus(userId);
    }

    await this.prisma.ledger.create({
      data: {
        userId,
        title: 'Daily Check-in',
        amount: 10,
        type: 'bonus',
        status: 'completed',
        date: today,
      },
    });

    return this.getStatus(userId);
  }
}
