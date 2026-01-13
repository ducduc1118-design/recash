import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/auth/auth.guard';
import { RolesGuard } from '../../common/auth/roles.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { Role, OrderStatus, WithdrawalStatus, TicketStatus } from '@prisma/client';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpsertStoreDto } from './dto/upsert-store.dto';
import { UpsertVoucherDto } from './dto/upsert-voucher.dto';
import { UpsertUserDto } from './dto/upsert-user.dto';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { CreateHomeSectionDto } from './dto/create-home-section.dto';
import { UpdateHomeSectionDto } from './dto/update-home-section.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.admin)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Post('users')
  createUser(@Body() payload: UpsertUserDto) {
    return this.adminService.createUser({
      email: payload.email || '',
      name: payload.name || 'New User',
      role: payload.role,
    });
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() payload: UpsertUserDto) {
    return this.adminService.updateUser(id, payload);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.removeUser(id);
  }

  @Get('stores')
  listStores() {
    return this.adminService.listStores();
  }

  @Post('stores')
  createStore(@Body() payload: UpsertStoreDto) {
    return this.adminService.createStore(payload);
  }

  @Patch('stores/:id')
  updateStore(@Param('id') id: string, @Body() payload: UpsertStoreDto) {
    return this.adminService.updateStore(id, payload);
  }

  @Delete('stores/:id')
  deleteStore(@Param('id') id: string) {
    return this.adminService.removeStore(id);
  }

  @Get('vouchers')
  listVouchers() {
    return this.adminService.listVouchers();
  }

  @Get('offers')
  listOffers() {
    return this.adminService.listVouchers();
  }

  @Post('vouchers')
  createVoucher(@Body() payload: UpsertVoucherDto) {
    return this.adminService.createVoucher(payload);
  }

  @Post('offers')
  createOffer(@Body() payload: UpsertVoucherDto) {
    return this.adminService.createVoucher(payload);
  }

  @Patch('vouchers/:id')
  updateVoucher(@Param('id') id: string, @Body() payload: UpsertVoucherDto) {
    return this.adminService.updateVoucher(id, payload);
  }

  @Patch('offers/:id')
  updateOffer(@Param('id') id: string, @Body() payload: UpsertVoucherDto) {
    return this.adminService.updateVoucher(id, payload);
  }

  @Delete('vouchers/:id')
  deleteVoucher(@Param('id') id: string) {
    return this.adminService.removeVoucher(id);
  }

  @Delete('offers/:id')
  deleteOffer(@Param('id') id: string) {
    return this.adminService.removeVoucher(id);
  }

  @Get('orders')
  listOrders() {
    return this.adminService.listOrders();
  }

  @Patch('orders/:id/status')
  updateOrder(@Param('id') id: string, @Body() payload: UpdateOrderStatusDto) {
    return this.adminService.updateOrderStatus(id, payload.status as OrderStatus);
  }

  @Patch('orders/:id')
  updateOrderCompat(@Param('id') id: string, @Body() payload: UpdateOrderStatusDto) {
    return this.adminService.updateOrderStatus(id, payload.status as OrderStatus);
  }

  @Get('withdrawals')
  listWithdrawals() {
    return this.adminService.listWithdrawals();
  }

  @Patch('withdrawals/:id/status')
  updateWithdrawal(@Param('id') id: string, @Body() payload: UpdateStatusDto) {
    return this.adminService.updateWithdrawalStatus(id, payload.status as WithdrawalStatus);
  }

  @Patch('withdrawals/:id')
  updateWithdrawalCompat(@Param('id') id: string, @Body() payload: UpdateStatusDto) {
    return this.adminService.updateWithdrawalStatus(id, payload.status as WithdrawalStatus);
  }

  @Get('tickets')
  listTickets() {
    return this.adminService.listTickets();
  }

  @Patch('tickets/:id/status')
  updateTicket(@Param('id') id: string, @Body() payload: UpdateStatusDto) {
    return this.adminService.updateTicketStatus(id, payload.status as TicketStatus);
  }

  @Get('settings')
  getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings')
  updateSettings(@Body() payload: Record<string, any>) {
    return this.adminService.updateSettings(payload);
  }

  @Get('banners')
  listBanners() {
    return this.adminService.listBanners();
  }

  @Post('banners')
  createBanner(@Body() payload: CreateBannerDto) {
    return this.adminService.createBanner(payload);
  }

  @Patch('banners/:id')
  updateBanner(@Param('id') id: string, @Body() payload: UpdateBannerDto) {
    return this.adminService.updateBanner(id, payload);
  }

  @Delete('banners/:id')
  deleteBanner(@Param('id') id: string) {
    return this.adminService.deleteBanner(id);
  }

  @Get('home-sections')
  listHomeSections() {
    return this.adminService.listHomeSections();
  }

  @Post('home-sections')
  createHomeSection(@Body() payload: CreateHomeSectionDto) {
    return this.adminService.createHomeSection(payload);
  }

  @Patch('home-sections/:id')
  updateHomeSection(@Param('id') id: string, @Body() payload: UpdateHomeSectionDto) {
    return this.adminService.updateHomeSection(id, payload);
  }

  @Delete('home-sections/:id')
  deleteHomeSection(@Param('id') id: string) {
    return this.adminService.deleteHomeSection(id);
  }
}
