import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  listTickets(userId: string) {
    return this.prisma.ticket.findMany({ where: { userId }, orderBy: { date: 'desc' } });
  }

  async createTicket(userId: string, payload: CreateTicketDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return this.prisma.ticket.create({
      data: {
        userId,
        subject: payload.subject,
        lastMessage: payload.message,
        user: user?.name || 'User',
      },
    });
  }
}
