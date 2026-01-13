import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/auth.guard';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getWallet(@Req() req: any) {
    return this.walletService.getWallet(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('ledger')
  getLedger(@Req() req: any) {
    return this.walletService.getLedger(req.user.id).then((entries) =>
      entries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        amount: `$${entry.amount.toFixed(2)}`,
        type: entry.type,
        status: entry.status,
        date: entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      })),
    );
  }
}
