import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StoresModule } from './modules/stores/stores.module';
import { VouchersModule } from './modules/vouchers/vouchers.module';
import { ClicksModule } from './modules/clicks/clicks.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { OrdersModule } from './modules/orders/orders.module';
import { WithdrawalsModule } from './modules/withdrawals/withdrawals.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SupportModule } from './modules/support/support.module';
import { CheckinModule } from './modules/checkin/checkin.module';
import { ReferralModule } from './modules/referral/referral.module';
import { AdminModule } from './modules/admin/admin.module';
import { MeModule } from './modules/me/me.module';
import { HomeModule } from './modules/home/home.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    StoresModule,
    VouchersModule,
    ClicksModule,
    WalletModule,
    OrdersModule,
    WithdrawalsModule,
    NotificationsModule,
    SupportModule,
    CheckinModule,
    ReferralModule,
    AdminModule,
    MeModule,
    HomeModule,
  ],
})
export class AppModule {}
