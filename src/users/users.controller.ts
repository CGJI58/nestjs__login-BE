import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAll(): User[] {
    return this.userService.getAll();
  }

  @Get(':id')
  getUser(@Param('id') userId: string): User {
    return this.userService.getOne(userId);
  }

  @Post()
  create(@Body() userData) {
    return this.userService.create(userData);
  }

  @Delete(':id')
  remove(@Param('id') userId: string) {
    return this.userService.deleteOne(userId);
  }
}
