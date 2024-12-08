import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':email')
  getUser(@Param('email') email: string) {
    return this.userService.getUser(email);
  }

  @Post('login')
  login(@Body('ghCode') ghCode: string) {
    return this.userService.login(ghCode);
  }

  @Post('update')
  update(@Body() body: { user: User }) {
    const user = body.user;
    return this.userService.updateUserState(user);
  }
}
