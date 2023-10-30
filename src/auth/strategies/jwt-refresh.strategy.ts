import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from '../types';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ email }: JwtPayload): Promise<User> {
    try {
      const user = await this.userService.findOneBy({ email });

      return user;
    } catch (error) {
      if (error?.message) {
        throw error;
      }
      throw new HttpException(
        'Непредвиденная ошибка обновления токена',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
