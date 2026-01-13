import { PrismaClient, Role, OrderStatus, LedgerType, LedgerStatus, WithdrawalStatus, NotificationType, TicketStatus, ReferralStatus, VoucherType, VoucherCategory } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const toMoney = (value: number) => Number(value.toFixed(2));

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      minWithdrawal: '10',
      signUpBonus: '5',
      referralBonus: '10',
      cashbackHoldDays: '60',
      maintenanceMode: false,
      allowRegistrations: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@recash.local' },
    update: {},
    create: {
      email: 'admin@recash.local',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: Role.admin,
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@recash.local' },
    update: {},
    create: {
      email: 'user@recash.local',
      passwordHash: userPassword,
      name: 'Alex Johnson',
      role: Role.user,
      phone: '+1 (555) 000-1234',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
  });

  const stores = await Promise.all([
    prisma.store.create({
      data: {
        name: 'Amazon',
        initials: 'AM',
        color: 'bg-orange-100 text-orange-600',
        cashbackUpTo: 12,
      },
    }),
    prisma.store.create({
      data: {
        name: 'Nike',
        initials: 'NI',
        color: 'bg-slate-100 text-slate-800',
        cashbackUpTo: 8,
      },
    }),
    prisma.store.create({
      data: {
        name: 'Sephora',
        initials: 'SE',
        color: 'bg-pink-100 text-pink-600',
        cashbackUpTo: 15,
      },
    }),
  ]);

  const [amazon, nike, sephora] = stores;

  await prisma.voucher.createMany({
    data: [
      {
        storeId: amazon.id,
        title: '15% off electronics',
        code: 'AMZ15',
        category: VoucherCategory.Tech,
        type: VoucherType.percent,
        expiry: '3 days',
        isHot: true,
      },
      {
        storeId: nike.id,
        title: 'Buy 2 get 1 free',
        code: 'NIKE2',
        category: VoucherCategory.Fashion,
        type: VoucherType.fixed,
        expiry: '1 week',
        isHot: true,
      },
      {
        storeId: sephora.id,
        title: 'Free shipping weekend',
        code: 'SHIPFREE',
        category: VoucherCategory.Food,
        type: VoucherType.shipping,
        expiry: '2 days',
        isHot: false,
      },
    ],
  });

  await prisma.order.create({
    data: {
      userId: user.id,
      storeName: 'Amazon',
      orderNumber: 'RC-20494',
      amount: toMoney(120.5),
      cashback: toMoney(10.2),
      status: OrderStatus.Pending,
      timeline: [
        { status: 'Order Placed', date: 'Oct 10', completed: true },
        { status: 'Merchant Confirmed', date: 'Oct 12', completed: true },
        { status: 'Cashback Pending', date: 'Oct 15', completed: false },
      ],
    },
  });

  await prisma.ledger.createMany({
    data: [
      {
        userId: user.id,
        title: 'Cashback from Amazon',
        amount: toMoney(10.2),
        type: LedgerType.earning,
        status: LedgerStatus.pending,
      },
      {
        userId: user.id,
        title: 'Withdrawal to Bank',
        amount: toMoney(50),
        type: LedgerType.withdrawal,
        status: LedgerStatus.completed,
      },
      {
        userId: user.id,
        title: 'Referral bonus',
        amount: toMoney(15),
        type: LedgerType.bonus,
        status: LedgerStatus.completed,
      },
    ],
  });

  await prisma.withdrawal.createMany({
    data: [
      {
        userId: user.id,
        user: user.name,
        method: 'bank',
        details: 'Bank Transfer',
        amount: toMoney(150),
        status: WithdrawalStatus.Pending,
      },
      {
        userId: user.id,
        user: user.name,
        method: 'ewallet',
        details: 'E-Wallet',
        amount: toMoney(80),
        status: WithdrawalStatus.Approved,
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: 'Cashback Approved',
        message: 'Your cashback for order RC-20494 has been approved.',
        time: '2h ago',
        type: NotificationType.success,
        read: false,
      },
      {
        userId: user.id,
        title: 'New Voucher',
        message: 'Nike just added a new voucher for you.',
        time: '1d ago',
        type: NotificationType.info,
        read: true,
      },
    ],
  });

  await prisma.ticket.createMany({
    data: [
      {
        userId: user.id,
        subject: 'Missing cashback',
        status: TicketStatus.Open,
        lastMessage: 'We are reviewing your order.',
        user: user.name,
      },
    ],
  });

  await prisma.referral.createMany({
    data: [
      {
        userId: user.id,
        name: 'Jamie Lee',
        earnings: toMoney(25),
        status: ReferralStatus.Shopped,
      },
      {
        userId: user.id,
        name: 'Morgan Park',
        earnings: toMoney(0),
        status: ReferralStatus.Registered,
      },
    ],
  });

  await prisma.click.create({
    data: {
      userId: user.id,
      url: 'https://amazon.com/product/123',
    },
  });

  await prisma.banner.createMany({
    data: [
      {
        title: 'Weekend Flash Sale',
        subtitle: 'Up to 20% cashback on top brands',
        imageUrl: 'https://picsum.photos/800/400?random=1',
        ctaText: 'Shop Now',
        ctaUrl: 'https://amazon.com',
        bgClass: 'bg-gradient-to-r from-orange-400 to-pink-500',
        textClass: 'text-white',
        isActive: true,
        priority: 3,
      },
      {
        title: 'New Member Bonus',
        subtitle: 'Earn extra points with your first order',
        imageUrl: 'https://picsum.photos/800/400?random=2',
        ctaText: 'Claim Bonus',
        ctaUrl: 'https://nike.com',
        bgClass: 'bg-gradient-to-r from-indigo-500 to-sky-500',
        textClass: 'text-white',
        isActive: true,
        priority: 2,
      },
      {
        title: 'Travel Deals',
        subtitle: 'Hotels + flights with cashback',
        imageUrl: 'https://picsum.photos/800/400?random=3',
        ctaText: 'Explore',
        ctaUrl: 'https://sephora.com',
        bgClass: 'bg-gradient-to-r from-emerald-400 to-teal-500',
        textClass: 'text-white',
        isActive: true,
        priority: 1,
      },
    ],
  });

  await prisma.homeSection.createMany({
    data: [
      {
        key: 'banners',
        title: 'Featured Deals',
        isActive: true,
        priority: 4,
        config: { style: 'carousel' },
      },
      {
        key: 'hotVouchers',
        title: 'Hot Vouchers',
        isActive: true,
        priority: 3,
        config: { limit: 6 },
      },
      {
        key: 'topStores',
        title: 'Top Stores',
        isActive: true,
        priority: 2,
        config: { limit: 8 },
      },
      {
        key: 'categories',
        title: 'Categories',
        isActive: true,
        priority: 1,
        config: { layout: 'grid' },
      },
    ],
  });

  await prisma.user.update({
    where: { id: admin.id },
    data: { name: 'Admin User' },
  });

  console.log('Seed complete');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
