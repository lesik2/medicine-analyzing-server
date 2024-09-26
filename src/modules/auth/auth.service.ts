import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import { CreateUserDto } from '../users/dto/create-user-dto';
import { ErrorMessages } from '@/common/error-messages';
import { MailService } from '../mail/mail.service';
import { confirmationMailSubject, resetPasswordMailSubject } from './constants';
import { RestorePasswordDto } from './dto/restore-password-dto';
import { ExcludeUserPassword } from '@/types/excludeUserPassword';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.findOne({
      email: createUserDto.email,
    });

    if (userExists) {
      throw new BadRequestException(ErrorMessages.USER_ALREADY_EXIST);
    }
    const newUser = await this.usersService.create(createUserDto);
    const tokens = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    this.mailService.sendMail({
      to: newUser.email,
      subject: confirmationMailSubject,
      template: 'confirmationEmail',
      context: {
        confirm_link: `${this.configService.get('email_confirmation_url')}?token=${tokens.refreshToken}`,
      },
    });
    return newUser;
  }

  async resendConfirmationEmail(email: string) {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
    }
    if (user.isEmailConfirmed) {
      throw new BadRequestException(ErrorMessages.USER_EMAIL_ALREADY_CONFIRMED);
    }
    const tokens = await this.getTokens(
      this.usersService.excludePasswordFromUser(user),
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    this.mailService.sendMail({
      to: email,
      subject: confirmationMailSubject,
      template: 'confirmationEmail',
      context: {
        confirm_link: `${this.configService.get('email_confirmation_url')}?token=${tokens.refreshToken}`,
      },
    });
  }

  async sendEmailForRestorePassword(email: string) {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
    }
    const tokens = await this.getTokens(
      this.usersService.excludePasswordFromUser(user),
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    this.mailService.sendMail({
      to: email,
      subject: resetPasswordMailSubject,
      template: 'resetPassword',
      context: {
        confirm_link: `${this.configService.get('email_reset_password_url')}?token=${tokens.refreshToken}&id=${user.id}`,
      },
    });
  }

  async restorePassword(restorePasswordDto: RestorePasswordDto) {
    const { userId, token, newPassword } = restorePasswordDto;
    const user = await this.usersService.findOne({
      id: userId,
    });
    if (!user) {
      throw new UnauthorizedException(ErrorMessages.WRONG_SIGN_IN_MESSAGE);
    }

    const authenticated = await this.usersService.decryptData(
      token,
      user.refreshToken,
    );
    if (!authenticated) {
      throw new UnauthorizedException(ErrorMessages.WRONG_SIGN_IN_MESSAGE);
    }
    return await this.usersService.update(userId, {
      password: await this.usersService.encryptData(newPassword),
    });
  }

  async login(user: ExcludeUserPassword) {
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { ...user, ...tokens };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken =
      await this.usersService.encryptData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne({ id: userId });
    if (!user || !user.refreshToken) throw new ForbiddenException();
    if (!user.isEmailConfirmed)
      throw new UnauthorizedException(
        ErrorMessages.USER_EMAIL_SHOULD_BE_CONFIRMED,
      );
    const refreshTokenMatches = await this.usersService.decryptData(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException();
    const userWithoutPassword = this.usersService.excludePasswordFromUser(user);
    const tokens = await this.getTokens(userWithoutPassword);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { ...userWithoutPassword, ...tokens };
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async getTokens(user: ExcludeUserPassword) {
    const tokenPayload: TokenPayload = user;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(tokenPayload, {
        secret: this.configService.get<string>('jwt_access_token_secret'),
        expiresIn: this.configService.get<string>(
          'jwt_access_token_expiration',
        ),
      }),
      this.jwtService.signAsync(tokenPayload, {
        secret: this.configService.get<string>('jwt_refresh_token_secret'),
        expiresIn: this.configService.get<string>(
          'jwt_refresh_token_expiration',
        ),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(email: string, password: string, token?: string) {
    const user = await this.usersService.findOne({
      email,
    });
    if (!user) {
      throw new UnauthorizedException(ErrorMessages.WRONG_SIGN_IN_MESSAGE);
    }
    if (!user.isEmailConfirmed) {
      const isEmailConfirmed = await this.usersService.decryptData(
        token,
        user.refreshToken,
      );

      if (!isEmailConfirmed) {
        throw new UnauthorizedException(
          ErrorMessages.USER_EMAIL_SHOULD_BE_CONFIRMED,
        );
      }
      await this.usersService.update(user.id, {
        isEmailConfirmed: true,
      });
    }
    const authenticated = await this.usersService.decryptData(
      password,
      user.password,
    );
    if (!authenticated) {
      throw new UnauthorizedException(ErrorMessages.WRONG_SIGN_IN_MESSAGE);
    }
    return this.usersService.excludePasswordFromUser(user);
  }
}
