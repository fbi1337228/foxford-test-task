import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { isDev } from 'src/utils/isDev';
import type { Request, Response } from 'express';
import type { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly COOKIE_DOMAIN: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
  }

  // Регистрация пользователя
  async register(res: Response, dto: AuthDto) {
    const { email, password } = dto;

    const existUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new ConflictException('Пользователь с такой почтой уже существует');
    }

    const user = await this.prismaService.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
      },
    });

    return this.auth(res, user.id);
  }

  // Логин пользователя
  async login(res: Response, dto: AuthDto) {
    const { email, password } = dto;

    const existUser = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
      },
    });

    if (!existUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isPAsswordValid = await bcrypt.compare(password, existUser.password);

    if (!isPAsswordValid) {
      throw new NotFoundException('Пользователь не найден');
    }

    return this.auth(res, existUser.id);
  }

  // Логаут пользователя
  async logout(res: Response) {
    this.setCookie(res, 'refreshToken', new Date(0));
  }

  async validate(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id
      }
    })

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  // Обновление Access токена по Refresh токену
  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Недействительный refresh-токен');
    }

    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

    if (payload) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      return this.auth(res, user.id);
    }
  }

  // Аутентификация пользователя (установка куки и возврат Access токена)
  private auth(res: Response, id: string) {
    const { accessToken, refreshToken } = this.generateTokens(id);

    this.setCookie(res, refreshToken, new Date(Date.now() + 60 * 60 * 24 * 7 * 1000)); // 7 дней (По хорошему тут должен быть реальный расчет даты из env)

    return { accessToken, userId: id };
  }

  // Генерация Access и Refresh токенов
  private generateTokens(id: string) {
    const payload: JwtPayload = { id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL,
    });

    return { accessToken, refreshToken };
  }

  // Установка Refresh токена в куки
  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'lax' : 'none',
    });
  }
}
