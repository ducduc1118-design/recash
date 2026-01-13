import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth/register')
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('auth/login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('auth/logout')
  @HttpCode(204)
  logout() {
    return;
  }
}
