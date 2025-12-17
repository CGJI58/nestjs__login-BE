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
