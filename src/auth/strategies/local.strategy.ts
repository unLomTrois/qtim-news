import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }
  async validate(req: Request, email: string, password: string): Promise<User> {
    try {
      const user = await this.authService.validateUser({
        email,
        password,
      });

      return user;
    } catch (error) {
      if (error?.message) {
        throw error;
      }
      throw new HttpException(
        'Непредвиденная ошибка авторизации',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
