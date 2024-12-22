import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('users')
@UseGuards(ThrottlerGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('ghcode') // 여기서 set cookie 알고리즘까지 포함할 것
  login(@Body('ghCode') ghCode: string) {
    return this.userService.loginByGhCode(ghCode);
  }

  @Post('hashcode') // 이거를 나중에 'get-cookie' 로 바꿀 것
  hashCheck(@Body('hashCode') hashCode: string) {
    return this.userService.loginByHashCode(hashCode);
  }

  @Post('update')
  update(@Body() body: { user: UserEntity }) {
    const user = body.user;
    return this.userService.updateUserDB(user);
  }
}
