import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

interface ICookieSettings {
  maxAge?: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'none';
  path?: string;
  domain?: string;
}

@Controller('auth')
export class AuthController {
  private readonly IS_LOCAL: boolean;
  private readonly cookieSettings: ICookieSettings;

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    const FE_DOMAIN = this.configService.get<string>('FE_DOMAIN');
    this.IS_LOCAL = FE_DOMAIN === 'localhost';
    this.cookieSettings = {
      httpOnly: !this.IS_LOCAL,
      secure: true,
      sameSite: 'none',
      path: '/',
      domain: this.configService.get<string>('BE_DOMAIN'),
    };
  }

  @Post('login-by-ghcode')
  @UseGuards(ThrottlerGuard)
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
  @UseGuards(AuthGuard('jwt'), ThrottlerGuard)
  async getUserByCookie(@Req() req: { user: { email: string } }) {
    console.log('Run getUserByCookie()');
    const { email } = req.user;
    if (!email) {
      throw new UnauthorizedException('Invalid token payload');
    }
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  @Post('delete-cookie')
  @UseGuards(AuthGuard('jwt'))
  async deleteCookie(@Res() res: Response) {
    console.log('Run logOut()');
    res.cookie('jwt', '', { ...this.cookieSettings, maxAge: 0 });
    res.status(HttpStatus.OK).send({ message: 'Cookie has been deleted' });
  }
}
