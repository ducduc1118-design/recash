import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/auth.guard';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) {}

  @UseGuards(JwtAuthGuard)
  @Get('tickets')
  listTickets(@Req() req: any) {
    return this.supportService.listTickets(req.user.id).then((tickets) =>
      tickets.map((ticket) => ({
        id: ticket.id,
        subject: ticket.subject,
        status: ticket.status,
        date: ticket.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        lastMessage: ticket.lastMessage,
      })),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('tickets')
  createTicket(@Req() req: any, @Body() payload: CreateTicketDto) {
    return this.supportService.createTicket(req.user.id, payload);
  }
}
