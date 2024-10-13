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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAll(): User[] {
    return this.userService.getAll();
  }

  @Get(':id')
  getUser(@Param('id') userId: number): User {
    return this.userService.getOne(userId);
  }

  @Post()
  create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete(':id')
  remove(@Param('id') userId: number) {
    return this.userService.deleteOne(userId);
  }

  @Patch(':id')
  patch(@Param('id') userId: number, @Body() updateData: UpdateUserDto) {
    return this.userService.update(userId, updateData);
  }
}
