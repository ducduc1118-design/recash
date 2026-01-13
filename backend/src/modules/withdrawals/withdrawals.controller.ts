import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/auth.guard';
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';

@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private withdrawalsService: WithdrawalsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() payload: CreateWithdrawalDto) {
    return this.withdrawalsService.create(req.user.id, payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req: any) {
    return this.withdrawalsService.list(req.user.id).then((items) =>
      items.map((item) => ({
        id: item.id,
        user: item.user,
        method: item.method,
        details: item.details,
        amount: `$${item.amount.toFixed(2)}`,
        date: item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: item.status,
      })),
    );
  }
}
