import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { formatCurrency } from '../../common/utils/format';
import { OrderStatus, WithdrawalStatus, TicketStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [userCount, orders, withdrawals, vouchers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.findMany(),
      this.prisma.withdrawal.findMany(),
      this.prisma.voucher.count(),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const pendingCashout = withdrawals
      .filter((w) => w.status === WithdrawalStatus.Pending)
      .reduce((sum, w) => sum + w.amount, 0);

    return {
      totalUsers: userCount,
      totalRevenue: formatCurrency(totalRevenue),
      pendingCashout: formatCurrency(pendingCashout),
      activeOffers: vouchers,
    };
  }

  async listUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const ledger = await this.prisma.ledger.findMany();

    return users.map((user) => {
      const balance = ledger
        .filter((entry) => entry.userId === user.id)
        .reduce((sum, entry) => {
          if (entry.type === 'earning' || entry.type === 'bonus') return sum + entry.amount;
          if (entry.type === 'withdrawal') return sum - entry.amount;
          return sum;
        }, 0);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        joined: user.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: formatCurrency(balance),
        status: 'Active',
      };
    });
  }

  async createUser(payload: { email: string; name: string; role?: string }) {
    const passwordHash = await bcrypt.hash('User123!', 10);
    return this.prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        role: payload.role as any,
        passwordHash,
      },
    });
  }

  updateUser(id: string, payload: Record<string, any>) {
    return this.prisma.user.update({ where: { id }, data: payload });
  }

  removeUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async listStores() {
    const stores = await this.prisma.store.findMany({ orderBy: { name: 'asc' } });
    return stores.map((store) => ({
      id: store.id,
      name: store.name,
      color: store.color,
      cashback: `${store.cashbackUpTo}%`,
    }));
  }

  createStore(payload: any) {
    return this.prisma.store.create({ data: payload });
  }

  updateStore(id: string, payload: any) {
    return this.prisma.store.update({ where: { id }, data: payload });
  }

  removeStore(id: string) {
    return this.prisma.store.delete({ where: { id } });
  }

  async listVouchers() {
    const vouchers = await this.prisma.voucher.findMany({
      include: { store: true },
      orderBy: { createdAt: 'desc' },
    });
    return vouchers.map((voucher) => ({
      id: voucher.id,
      title: voucher.title,
      category: voucher.category,
      store: voucher.store.name,
      code: voucher.code,
      expiry: voucher.expiry,
      status: voucher.isHot ? 'Active' : 'Draft',
    }));
  }

  createVoucher(payload: any) {
    return this.prisma.voucher.create({ data: payload });
  }

  updateVoucher(id: string, payload: any) {
    return this.prisma.voucher.update({ where: { id }, data: payload });
  }

  removeVoucher(id: string) {
    return this.prisma.voucher.delete({ where: { id } });
  }

  async listOrders() {
    const orders = await this.prisma.order.findMany({ orderBy: { date: 'desc' } });
    const users = await this.prisma.user.findMany();

    return orders.map((order) => {
      const user = users.find((u) => u.id === order.userId);
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        user: user?.name || 'User',
        storeName: order.storeName,
        amount: formatCurrency(order.amount),
        cashback: formatCurrency(order.cashback),
        status: order.status,
        date: order.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timeline: order.timeline,
      };
    });
  }

  updateOrderStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({ where: { id }, data: { status } });
  }

  async listWithdrawals() {
    const withdrawals = await this.prisma.withdrawal.findMany({
      orderBy: { date: 'desc' },
    });
    return withdrawals.map((item) => ({
      id: item.id,
      user: item.user,
      method: item.method,
      details: item.details,
      amount: formatCurrency(item.amount),
      date: item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: item.status,
    }));
  }

  updateWithdrawalStatus(id: string, status: WithdrawalStatus) {
    return this.prisma.withdrawal.update({ where: { id }, data: { status } });
  }

  async listTickets() {
    const tickets = await this.prisma.ticket.findMany({ orderBy: { date: 'desc' } });
    return tickets.map((ticket) => ({
      id: ticket.id,
      subject: ticket.subject,
      status: ticket.status,
      date: ticket.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      lastMessage: ticket.lastMessage,
      user: ticket.user,
    }));
  }

  updateTicketStatus(id: string, status: TicketStatus) {
    return this.prisma.ticket.update({ where: { id }, data: { status } });
  }

  async getSettings() {
    const defaults = {
      minWithdrawal: '10',
      signUpBonus: '5',
      referralBonus: '10',
      cashbackHoldDays: '60',
      maintenanceMode: false,
      allowRegistrations: true,
    };
    const setting = await this.prisma.settings.findUnique({ where: { id: 1 } });
    if (setting) {
      const { minWithdrawal, signUpBonus, referralBonus, cashbackHoldDays, maintenanceMode, allowRegistrations } = setting;
      return { minWithdrawal, signUpBonus, referralBonus, cashbackHoldDays, maintenanceMode, allowRegistrations };
    }
    return defaults;
  }

  async updateSettings(payload: Record<string, any>) {
    const defaults = {
      minWithdrawal: '10',
      signUpBonus: '5',
      referralBonus: '10',
      cashbackHoldDays: '60',
      maintenanceMode: false,
      allowRegistrations: true,
    };
    const updated = await this.prisma.settings.upsert({
      where: { id: 1 },
      update: payload,
      create: { id: 1, ...defaults, ...payload },
    });
    const { minWithdrawal, signUpBonus, referralBonus, cashbackHoldDays, maintenanceMode, allowRegistrations } = updated;
    return { minWithdrawal, signUpBonus, referralBonus, cashbackHoldDays, maintenanceMode, allowRegistrations };
  }

  listBanners() {
    return this.prisma.banner.findMany({ orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }] });
  }

  createBanner(payload: Record<string, any>) {
    return this.prisma.banner.create({
      data: {
        ...payload,
        startsAt: payload.startsAt ? new Date(payload.startsAt) : null,
        endsAt: payload.endsAt ? new Date(payload.endsAt) : null,
      },
    });
  }

  updateBanner(id: string, payload: Record<string, any>) {
    return this.prisma.banner.update({
      where: { id },
      data: {
        ...payload,
        startsAt: payload.startsAt ? new Date(payload.startsAt) : undefined,
        endsAt: payload.endsAt ? new Date(payload.endsAt) : undefined,
      },
    });
  }

  deleteBanner(id: string) {
    return this.prisma.banner.delete({ where: { id } });
  }

  listHomeSections() {
    return this.prisma.homeSection.findMany({ orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }] });
  }

  createHomeSection(payload: Record<string, any>) {
    return this.prisma.homeSection.create({ data: payload });
  }

  updateHomeSection(id: string, payload: Record<string, any>) {
    return this.prisma.homeSection.update({ where: { id }, data: payload });
  }

  deleteHomeSection(id: string) {
    return this.prisma.homeSection.delete({ where: { id } });
  }
}
