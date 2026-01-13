import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/auth.guard';
import { CheckinService } from './checkin.service';

@Controller('checkin')
export class CheckinController {
  constructor(private checkinService: CheckinService) {}

  @UseGuards(JwtAuthGuard)
  @Get('status')
  getStatus(@Req() req: any) {
    return this.checkinService.getStatus(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('today')
  checkinToday(@Req() req: any) {
    return this.checkinService.checkinToday(req.user.id);
  }
}
