import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/user.entity';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import { CreateUserDto } from '../users/dto/create-user-dto';
import { ErrorMessages } from '@/common/error-messages';

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
    const tokens = await this.getTokens(newUser.id);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async login(user: User) {
    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    console.log(refreshToken);
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
    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async getTokens(userId: string) {
    const tokenPayload: TokenPayload = {
      userId,
    };

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
      return user;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new UnauthorizedException('Credentials are not valid.');
      }
    }
  }
}
