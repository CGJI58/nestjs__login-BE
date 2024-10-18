import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAll(): User[] {
    return this.userService.getAll();
  }

  @Get('login')
  create(@Query('code') code: string) {
    console.log(code);
    return this.userService.create(code);
  }
}
