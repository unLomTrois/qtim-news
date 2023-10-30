import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Response, Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LocalGuard } from './guards/LocalGuard';
import { JwtRefreshGuard } from './guards/JwtRefreshGuard';
import { JwtPayload } from './types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Res({ passthrough: true }) response: Response<User>,
    @Body() registerDto: RegisterDto,
  ) {
    const user = await this.authService.register(registerDto);

    const payload = { email: user.email };

    const access_token = this.authService.getJwtAccessToken(payload);
    const refresh_token = this.authService.getJwtRefreshToken(payload);

    response.setHeader('Set-Cookie', [
      access_token.cookie,
      refresh_token.cookie,
    ]);

    return user;
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(
    @Req() request: Request & { user: User },
    @Res({ passthrough: true }) response: Response & { user: User },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() createAuthDto: LoginDto,
  ) {
    const { user } = request;

    const payload: JwtPayload = { email: user.email };
    const access_token = this.authService.getJwtAccessToken(payload);
    const refresh_token = this.authService.getJwtRefreshToken(payload);

    response.setHeader('Set-Cookie', [
      access_token.cookie,
      refresh_token.cookie,
    ]);

    user.password = undefined;

    return user;
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(
    @Req() request: Request & { user: User },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user } = request;

    const new_access_token = this.authService.getJwtAccessToken({
      email: user.email,
    });
    response.setHeader('Set-Cookie', new_access_token.cookie);

    user.password = undefined;
    return user;
  }
}
