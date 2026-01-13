import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { formatCurrency } from '../../common/utils/format';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string, status?: OrderStatus) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: { date: 'desc' },
    });

    return orders.map((order) => ({
      id: order.id,
      storeName: order.storeName,
      orderNumber: order.orderNumber,
      date: order.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: formatCurrency(order.amount),
      cashback: formatCurrency(order.cashback),
      status: order.status,
      timeline: order.timeline,
    }));
  }

  async getById(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({ where: { id, userId } });
    if (!order) return null;
    return {
      id: order.id,
      storeName: order.storeName,
      orderNumber: order.orderNumber,
      date: order.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: formatCurrency(order.amount),
      cashback: formatCurrency(order.cashback),
      status: order.status,
      timeline: order.timeline,
    };
  }
}
