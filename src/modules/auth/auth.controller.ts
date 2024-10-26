import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { CurrentUser } from '../../decorators/current-user-decorator';

import { CreateUserDto } from '../users/dto/create-user-dto';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { EmailDto } from './dto/resend-confirmation-email-dto';
import { Throttle } from '@nestjs/throttler';
import { RestorePasswordDto } from './dto/restore-password-dto';
import { ExcludeUserPassword } from '@/types/excludeUserPassword';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from './dto/login-request-dto';
import { LoginResponseDto } from './dto/login-response-dto';
import { ExcludeUserResponseDto } from './dto/exclude-user-response-dto';
import { TokenResponseDto } from './dto/tokens-response-dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    description: 'User login credentials',
    type: LoginRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid email or password.',
  })
  async login(
    @CurrentUser() user: ExcludeUserPassword,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(user);
  }

  @Post('resend')
  @Throttle({ default: { limit: 1, ttl: 10000 } })
  async resendConfirmationEmail(@Body() resendConfirmationEmailDto: EmailDto) {
    await this.authService.resendConfirmationEmail(
      resendConfirmationEmailDto.email,
    );
  }

  @Post('recall')
  @Throttle({ default: { limit: 1, ttl: 10000 } })
  async sendEmailForRestorePassword(@Body() emailDto: EmailDto) {
    await this.authService.sendEmailForRestorePassword(emailDto.email);
  }

  @Post('restore')
  async restorePassword(@Body() restorePasswordDto: RestorePasswordDto) {
    return await this.authService.restorePassword(restorePasswordDto);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    type: ExcludeUserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. The provided data is invalid.',
  })
  signup(@Body() createUserDto: CreateUserDto): Promise<ExcludeUserPassword> {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user['id']);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  @ApiOperation({ summary: 'Refresh access tokens' })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed.',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized. Invalid refresh token or user not authenticated.',
  })
  refreshTokens(@Req() req: Request) {
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
