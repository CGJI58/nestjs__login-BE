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

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login-by-ghcode')
  async loginByGhCode(@Body('ghCode') ghCode: string, @Res() res: Response) {
    console.log('Run loginByGhCode()');
    try {
      const result = await this.authService.loginByGhCode(ghCode);
      const maxAge =
        Number(process.env.JWT_EXPIRED_IN_HOUR ?? '24') * 3600 * 1000;
      res.cookie('jwt', result.jwt, {
        maxAge,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      res.status(HttpStatus.OK).send(result.user);
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
        res.status(HttpStatus.OK).send(user);
      }
    }
  }

  @Post('delete-cookie')
  async deleteCookie(@Res() res: Response) {
    console.log('Run logOut()');
    res.cookie('jwt', '', {
      expires: new Date(0),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res
      .status(HttpStatus.OK)
      .send({ message: 'Cookie has been deleted successfully' });
  }
}
