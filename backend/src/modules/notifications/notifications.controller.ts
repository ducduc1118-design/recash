import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req: any) {
    return this.notificationsService.list(req.user.id).then((items) =>
      items.map((item) => ({
        id: item.id,
        title: item.title,
        message: item.message,
        time: item.time,
        read: item.read,
        type: item.type,
      })),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/read')
  markRead(@Req() req: any, @Param('id') id: string) {
    return this.notificationsService.markRead(req.user.id, id);
  }
}
