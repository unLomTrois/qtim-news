import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async verifyPassword(password: string, hashed_password: string) {
    const isPasswordMatching = await bcrypt.compare(password, hashed_password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Неправильный логин или пароль!');
    }
    return isPasswordMatching;
  }

  async validateUser(dto: LoginDto): Promise<User> {
    const user = await this.userService.findOneBy({ email: dto.email });
    await this.verifyPassword(dto.password, user.password);
    return user;
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const password_hash = await bcrypt.hash(registerDto.password, 10);

    registerDto.password = password_hash;

    const user = await this.userService.create(registerDto);

    return user;
  }

  public getJwtAccessToken(payload: JwtPayload): {
    cookie: string;
    token: string;
  } {
    const jwtAccessExpireTime = this.configService.get(
      'JWT_ACCESS_EXPIRATION_TIME',
    );

    const token = this.jwtService.sign(payload, {
      expiresIn: `${jwtAccessExpireTime}s`,
    });
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtAccessExpireTime}`;

    return { cookie, token };
  }

  public getJwtRefreshToken(payload: JwtPayload): {
    cookie: string;
    token: string;
  } {
    const jwtRefreshExpireTime = this.configService.get(
      'JWT_REFRESH_EXPIRATION_TIME',
    );

    const token = this.jwtService.sign(payload, {
      expiresIn: `${jwtRefreshExpireTime}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${jwtRefreshExpireTime}`;

    return { cookie, token };
  }
}
