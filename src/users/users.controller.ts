import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('users')
@UseGuards(ThrottlerGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('ghcode')
  login(@Body('ghCode') ghCode: string) {
    return this.userService.loginByGhCode(ghCode);
  }

  @Post('hashcode')
  hashCheck(@Body('hashCode') hashCode: string) {
    return this.userService.loginByHashCode(hashCode);
  }

  @Post('update')
  update(@Body() body: { user: UserEntity }) {
    const user = body.user;
    return this.userService.updateUser(user);
  }
}
