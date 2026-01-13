import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/auth.guard';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req: any, @Query('status') status?: OrderStatus) {
    return this.ordersService.list(req.user.id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.getById(req.user.id, id);
  }
}
