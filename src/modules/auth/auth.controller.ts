import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { CurrentUser } from './decorators/current-user-decorator';

import { CreateUserDto } from '../users/dto/create-user-dto';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { ExcludeUserPassword } from '../users/interfaces/excludeUserPassword';
import { ResendConfirmationEmailDto } from './dto/resend-confirmation-email-dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: ExcludeUserPassword) {
    return await this.authService.login(user);
  }

  @Post('resend')
  @Throttle({ default: { limit: 1, ttl: 10000 } })
  async resendConfirmationEmail(
    @Body() resendConfirmationEmailDto: ResendConfirmationEmailDto,
  ) {
    await this.authService.resendConfirmationEmail(
      resendConfirmationEmailDto.email,
    );
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user['id']);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
