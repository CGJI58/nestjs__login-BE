import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

interface ICookieSettings {
  maxAge?: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'none';
  path?: string;
  domain?: string;
}

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  private readonly IS_LOCAL: boolean;
  private readonly cookieSettings: ICookieSettings;

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.IS_LOCAL =
      this.configService.get<string>('FE_URL') === 'http://localhost:3000';
    this.cookieSettings = {
      httpOnly: !this.IS_LOCAL,
      secure: !this.IS_LOCAL,
      sameSite: this.IS_LOCAL ? 'lax' : 'none',
      path: '/',
      domain: this.configService.get<string>('FE_DOMAIN'),
    };
  }

  @Post('login-by-ghcode')
  async loginByGhCode(@Body('ghCode') ghCode: string, @Res() res: Response) {
    console.log('Run loginByGhCode()');
    try {
      const { jwt } = await this.authService.loginByGhCode(ghCode);
      const maxAge =
        Number(process.env.JWT_EXPIRED_IN_HOUR ?? '24') * 3600 * 1000;
      res.cookie('jwt', jwt, { ...this.cookieSettings, maxAge });
      res.status(HttpStatus.OK).send({ message: 'login success.' });
    } catch (error) {
      console.error('Error in loginByGhCode():', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }

  @Get('get-user-by-cookie')
  async getUserByCookie(@Req() req: Request, @Res() res: Response) {
    console.log('Run getUserByCookie()');
    if (req.headers.cookie) {
      const jwt = req.headers.cookie?.replace('jwt=', '');
      //jwt 가 정상적인지 검사
      if (jwt) {
        const email = await this.authService.decodeJWT(jwt); // 오류처리 코드 추가할 것.
        const user = await this.usersService.getUserByEmail(email);
        if (user) {
          res.status(HttpStatus.OK).send(user);
        } else {
          res
            .status(HttpStatus.UNAUTHORIZED)
            .send('Invalid token. No matched user.');
        }
      }
    }
  }

  @Post('delete-cookie')
  async deleteCookie(@Res() res: Response) {
    console.log('Run logOut()');
    res.cookie('jwt', '', { ...this.cookieSettings, maxAge: 0 });
    res
      .status(HttpStatus.OK)
      .send({ message: 'Cookie has been deleted successfully' });
  }
}
