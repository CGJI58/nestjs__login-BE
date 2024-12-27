import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login-by-ghcode')
  loginByGhCode(@Body('ghCode') ghCode: string) {
    console.log('Run getUserByGhCode()');
    return this.authService.loginByGhCode(ghCode);
  }

  @Get('get-user-by-cookie')
  getUserByCookie() {
    console.log('Run getUserByCookie()');
    return this.authService.loginByCookie();
  }

  @Get('delete-cookie')
  deleteCookie() {
    console.log('Run logOut()');
    return this.authService.deleteCookie();
  }
}
