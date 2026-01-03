import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import { DiariesService } from './diaries.service';
import { CreateDiaryReqDto, UpdateDiaryReqDto } from './entities/diary.entity';
import { User } from 'src/users/user.decorator';

/**
 * add, update, delete diary 가 실행되었을 때,
 * 거기서 writer 정보를 찾아서 그걸 바탕으로 usersService에서 myDiaries 프랍을 갱신하도록
 * 하는 로직을 추가해야 함.
 * FE는 이미 관련 작업 다 되어 있으니 BE에서만 작업할 것.
 * 그리고 나서, FE에서 레이아웃에서 userState 변경 감지해서 BE로 요청 넣는거 다 없애고,
 * 변경이 발생하는 하위 컴포넌트들에서 각자 필요한 api 함수를 호출하여 처리하도록 수정할 것.
 */

@UseGuards(AuthGuard('jwt'), ThrottlerGuard)
@Controller('diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Get('')
  async getDiaries(@User('githubId') userId: number) {
    console.log('Run getDiaries():', userId);
    return this.diariesService.getDiaryEntities(userId);
  }

  @Post('')
  async createDiary(@Body() body: CreateDiaryReqDto) {
    console.log('Run addDiary()');
    const { userId, title, text } = body;
    return this.diariesService.saveDiaryDoc({ userId, title, text });
  }

  @Patch('')
  updateDiary(@Body() body: UpdateDiaryReqDto) {
    console.log('Run updateDiary()');
    const { diaryId, userId, title, text } = body;
    return this.diariesService.updateDiaryDoc({ diaryId, userId, title, text });
  }

  @Delete(':diaryId')
  async deleteDiary(
    @Param('diaryId') diaryId: string,
    @User('githubId') userId: number,
  ) {
    console.log('Run deleteDiary()');
    return this.diariesService.deleteDiaryDoc({ diaryId, userId });
  }
}
