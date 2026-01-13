import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { UpdateMeDto } from '../auth/dto/update-me.dto';

@Controller()
export class MeController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    return this.authService.getMe(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Req() req: any, @Body() payload: UpdateMeDto) {
    return this.authService.updateMe(req.user.id, payload);
  }
}
