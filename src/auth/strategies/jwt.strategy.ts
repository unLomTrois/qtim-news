import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { JwtPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ email }: JwtPayload): Promise<{
    user: User;
  }> {
    try {
      const user = await this.userService.findOneBy({ email });

      return { user };
    } catch (error) {
      if (error?.message) {
        throw error;
      }
      throw new HttpException(
        'Непредвиденная ошибка с токеном',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
