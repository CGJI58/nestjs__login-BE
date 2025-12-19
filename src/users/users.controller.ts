import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'), ThrottlerGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 이후로는 user 객체를 통째로 보내지 말고 아래와 같이 세 가지로 분리하여 보낼 것.
   * userInfo : 로그인할 때 전달 (사용자를 식별하기 위해)
   * userConfig : 사용자 정보 줄 때 전달 (FE userState 비어있으면 보내줘야 할 기본 정보)
   * userRecord : myDiaries 정보 요청이 들어오면 전달
   */

  @Post('update')
  update(@Body() body: { user: UserEntity }) {
    console.log('Run update()');
    const { user } = body;
    return this.usersService.updateUserDoc(user);
  }

  @Delete('')
  deleteUser(@Body() body: { githubId: number }) {
    console.log('Run deleteUser()');
    const { githubId } = body;
    return this.usersService.deleteUserDoc(githubId);
  }

  @Get('validate-nickname')
  async validateNickname(
    @Query('nickname') nickname: string,
    @Res() res: Response,
  ) {
    try {
      const isValid = await this.usersService.validateNickname(nickname);
      console.log('isValid: ', isValid);

      // 응답 보내기
      res.status(200).json({ isValid });
    } catch (error) {
      console.error('Error validating nickname:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get('my-diaries')
  getMyDiaries() {}
}
