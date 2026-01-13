import { Controller, Get, Param, Query } from '@nestjs/common';
import { VouchersService } from './vouchers.service';

@Controller('vouchers')
export class VouchersController {
  constructor(private vouchersService: VouchersService) {}

  @Get()
  list(@Query('search') search?: string, @Query('category') category?: string, @Query('type') type?: string) {
    return this.vouchersService.list({ search, category, type });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.vouchersService.getById(id);
  }
}
