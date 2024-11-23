import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { IGetUser, UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAll(): User[] {
    return this.userService.getAll();
  }

  @Post('login')
  login(@Body('ghCode') ghCode: string) {
    return this.userService.login(ghCode);
  }

  @Get(':ghCode')
  getUser(@Param('ghCode') ghCode: string): IGetUser {
    return this.userService.getUser(ghCode);
  }
}
