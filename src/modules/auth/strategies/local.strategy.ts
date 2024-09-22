import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Request } from 'express';

interface AuthRequest extends Request {
  body: {
    email: string;
    password: string;
    token?: string; // Optional token
  };
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(req: AuthRequest, email: string, password: string) {
    const token = req.body.token;
    return this.authService.validateUser(email, password, token);
  }
}
