import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('users')
@UseGuards(ThrottlerGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('update')
  update(@Body() body: { user: UserEntity }) {
    console.log('Run update()');
    const user = body.user;
    return this.usersService.updateUserDB(user);
  }
}
