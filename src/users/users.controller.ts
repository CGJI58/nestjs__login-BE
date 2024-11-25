import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInfo } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('login')
  login(@Body('ghCode') ghCode: string) {
    return this.userService.login(ghCode);
  }

  @Get(':ghCode')
  getUser(@Param('ghCode') ghCode: string): UserInfo {
    return this.userService.getUser(ghCode);
  }
}
