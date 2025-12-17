import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import { DiariesService } from './diaries.service';
import { DiaryEntity } from './entities/diary.entity';

/**
 * add, update, delete diary 가 실행되었을 때,
 * 거기서 writer 정보를 찾아서 그걸 바탕으로 usersService에서 myDiaries 프랍을 갱신하도록
 * 하는 로직을 추가해야 함.
 * FE는 이미 관련 작업 다 되어 있으니 BE에서만 작업할 것.
 * 그리고 나서, FE에서 레이아웃에서 userState 변경 감지해서 BE로 요청 넣는거 다 없애고,
 * 변경이 발생하는 하위 컴포넌트들에서 각자 필요한 api 함수를 호출하여 처리하도록 수정할 것.
 */

@Controller('diaries')
@UseGuards(AuthGuard('jwt'), ThrottlerGuard)
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Get('')
  async getDiaries() {
    console.log('Run getDiaries()');
    return this.diariesService.getDiaryEntities();
  }

  @Post('')
  async addDiary(@Body() body: { diary: DiaryEntity }) {
    console.log('Run addDiary()');
    const { diary } = body;
    return this.diariesService.saveDiaryDoc(diary);
  }

  @Put('')
  updateDiary(@Body() body: { diary: DiaryEntity }) {
    console.log('Run updateDiary()');
    const { diary } = body;
    return this.diariesService.updateDiaryDoc(diary);
  }

  @Delete(':diaryId')
  deleteDiary(@Param('diaryId', ParseIntPipe) diaryId: number) {
    console.log('Run deleteDiary()');
    return this.diariesService.deleteDiaryDoc(diaryId);
  }
}
