/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(
    err: any,
    user: any,
    info: any,
    context: any,
    status: any,
  ): any {
    if (info?.message == 'No auth token') {
      throw new UnauthorizedException('Авторизируйтесь!');
    }
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Просрочен токен авторизации!');
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid Token!');
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
