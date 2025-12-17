import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { COOKIE_MAXAGE } from 'src/constants/constants';
import {
  getCookieSettings,
  ICookieSettings,
} from 'src/constants/cookie-settings';

@Controller('auth')
export class AuthController {
  private readonly cookieSettings: ICookieSettings;

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.cookieSettings = getCookieSettings(this.configService);
  }

  @Post('cookie')
  @UseGuards(ThrottlerGuard)
  async loginByGhCode(@Body('ghCode') ghCode: string, @Res() res: Response) {
    console.log('Run loginByGhCode()');
    try {
      const { jwt } = await this.authService.loginByGhCode(ghCode);
      const maxAge = COOKIE_MAXAGE;
      res.cookie('jwt', jwt, { ...this.cookieSettings, maxAge });
      res.cookie('jwtExpires', Date.now() + maxAge, {
        ...this.cookieSettings,
        maxAge,
      });

      res.status(HttpStatus.OK).send({ message: 'login success.' });
    } catch (error) {
      console.error('Error in loginByGhCode():', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }

  @Get('cookie')
  @UseGuards(AuthGuard('jwt'), ThrottlerGuard)
  async getUserByCookie(
    @Req() req: { user: { email: string } },
    @Res() res: Response,
  ) {
    console.log('Run getUserByCookie()');
    res.setHeader('Cache-Control', 'no-store');
    const { email } = req.user; // from JwtStrategy.validate()
    if (!email) {
      throw new UnauthorizedException('Invalid token payload');
    }
    const user = await this.usersService.getUserEntity(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return res.json(user);
  }

  @Delete('cookie')
  @UseGuards(AuthGuard('jwt'))
  async deleteCookie(@Res() res: Response) {
    console.log('Run logOut()');
    res.cookie('jwt', '', { ...this.cookieSettings, maxAge: 0 });
    res.cookie('jwtExpires', '', { ...this.cookieSettings, maxAge: 0 });
    res.status(HttpStatus.OK).send({ message: 'Cookie has been deleted' });
  }
}
