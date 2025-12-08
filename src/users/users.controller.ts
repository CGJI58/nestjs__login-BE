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

  @Post('update')
  update(@Body() body: { user: UserEntity }) {
    console.log('Run update()');
    const { user } = body;
    return this.usersService.updateUserDB(user);
  }

  @Delete('delete')
  delete(@Body() body: { email: string }) {
    console.log('Run delete()');
    const { email } = body;
    return this.usersService.deleteUser(email);
  }

  @Get('validate/nickname')
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
}
