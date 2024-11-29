import { Body, Controller, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('login')
  login(@Body('ghCode') ghCode: string) {
    return this.userService.login(ghCode);
  }

  @Patch('logout')
  logout(@Body() body: any) {
    const user: User = body.user;
    return this.userService.logout(user);
  }
}
