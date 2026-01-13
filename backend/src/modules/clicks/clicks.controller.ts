import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/auth/auth.guard';
import { ClicksService } from './clicks.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Controller()
export class ClicksController {
  constructor(private clicksService: ClicksService, private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('clicks/create-link')
  createLink(@Req() req: any, @Body() payload: CreateLinkDto) {
    return this.clicksService.createLink(req.user.id, payload.url);
  }

  @Get('r/:clickId')
  async redirect(@Param('clickId') clickId: string, @Res() res: Response) {
    const click = await this.prisma.click.findUnique({ where: { id: clickId } });
    if (!click) {
      return res.status(404).send('Not found');
    }
    return res.redirect(click.url);
  }
}
