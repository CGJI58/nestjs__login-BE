import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('users')
@UseGuards(ThrottlerGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('get-user-by-ghcode')
  getUserByGhCode(@Body('ghCode') ghCode: string): Promise<UserEntity> {
    console.log('Run getUserByGhCode()');
    return this.userService.loginByGhCode(ghCode);
  }

  @Post('update')
  update(@Body() body: { user: UserEntity }) {
    console.log('Run update()');
    const user = body.user;
    return this.userService.updateUserDB(user);
  }
}
