import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('login')
  login(@Body('ghCode') ghCode: string) {
    return this.userService.login(ghCode);
  }

  @Post('update')
  update(@Body() body: { user: UserEntity }) {
    const user = body.user;
    return this.userService.updateUserState(user);
  }
}
