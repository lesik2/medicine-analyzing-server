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
import { ExcludeUserPassword } from '../users/interfaces/excludeUserPassword';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.findOne({
      email: createUserDto.email,
    });

    if (userExists) {
      throw new BadRequestException(ErrorMessages.USER_ALREADY_EXIST);
    }

    const newUser = await this.usersService.create(createUserDto);
    return newUser;
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

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findOne({
        email,
      });
      if (!user) {
        throw new UnauthorizedException();
      }
      const authenticated = await this.usersService.decryptData(
        password,
        user.password,
      );
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return this.usersService.excludePasswordFromUser(user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new UnauthorizedException(ErrorMessages.WRONG_SIGN_IN_MESSAGE);
      }
    }
  }
}
