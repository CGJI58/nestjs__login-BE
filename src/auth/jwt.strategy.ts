import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { COOKIE_MAXAGE } from 'src/constants/constants';
import { ConfigService } from '@nestjs/config';
import {
  getCookieSettings,
  ICookieSettings,
} from 'src/constants/cookie-settings';
import { JwtPayload } from 'src/@types/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly cookieSettings: ICookieSettings;
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.jwt,
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true, //req를 validate에서 사용 가능
    });

    this.cookieSettings = getCookieSettings(this.configService);
  }

  validate(req: Request, payload: JwtPayload) {
    const cookieExpires = Number(req.cookies?.jwtExpires);

    if (!cookieExpires) {
      throw new UnauthorizedException('쿠키 만료 정보 없음');
    }

    if (Date.now() > cookieExpires) {
      throw new UnauthorizedException('쿠키가 만료되었습니다');
    }

    const newExpires = Date.now() + COOKIE_MAXAGE;

    const res = req.res;
    res?.cookie('jwtExpires', newExpires, {
      ...this.cookieSettings,
      maxAge: COOKIE_MAXAGE,
    });

    return payload;
  }
}
