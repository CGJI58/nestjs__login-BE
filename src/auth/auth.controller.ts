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
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CustomRequest } from 'src/types/express-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login-by-ghcode')
  async loginByGhCode(@Body('ghCode') ghCode: string, @Res() res: Response) {
    console.log('Run loginByGhCode()');
    try {
      const result = await this.authService.loginByGhCode(ghCode);
      const maxAge = Number(process.env.JWT_EXPIRED_HOUR ?? '24') * 3600 * 1000; // 배포 시 배포서버 상태변수에 추가할 것.
      res.cookie('jwt', result.jwt, {
        // httpOnly: true, // 배포 시 주석 해제
        maxAge,
      });
      res.status(HttpStatus.OK).send(result.user);
    } catch (error) {
      console.error('Error in loginByGhCode():', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }

  @Get('get-user-by-cookie')
  @UseGuards(AuthGuard('jwt'))
  async getUserByCookie(@Req() req: CustomRequest, @Res() res: Response) {
    console.log('Run getUserByCookie()');
    res.status(HttpStatus.OK).send(req.user);
  }

  @Post('delete-cookie')
  async deleteCookie(@Res() res: Response) {
    console.log('Run logOut()');
    // res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) }); // 배포 시 이걸로 변경
    res.cookie('jwt', '', { expires: new Date(0) });
    res
      .status(HttpStatus.OK)
      .send({ message: 'Cookie has been deleted successfully' });
  }
}
