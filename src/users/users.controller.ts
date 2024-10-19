import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAll(): User[] {
    return this.userService.getAll();
  }

  @Post('login')
  create(@Body('ghCode') ghCode: string) {
    console.log(`ghCode in controller: ${ghCode}`);
    return this.userService.create(ghCode);
  }
}
