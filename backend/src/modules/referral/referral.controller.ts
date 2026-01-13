import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/auth.guard';
import { ReferralService } from './referral.service';

@Controller('referral')
export class ReferralController {
  constructor(private referralService: ReferralService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req: any) {
    return this.referralService.list(req.user.id).then((referrals) =>
      referrals.map((referral) => ({
        id: referral.id,
        name: referral.name,
        status: referral.status,
        earnings: `$${referral.earnings.toFixed(2)}`,
        date: referral.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      })),
    );
  }
}
