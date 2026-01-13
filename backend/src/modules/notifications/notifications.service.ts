import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.notification.findMany({ where: { userId } });
  }

  markRead(userId: string, id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }
}
