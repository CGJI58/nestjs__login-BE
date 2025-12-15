import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
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

  @Post('add')
  async addDiary(@Body() body: { diary: DiaryEntity }) {
    console.log('Run addDiary()');
    const { diary } = body;
    return this.diariesService.saveDiaryDoc(diary);
  }

  @Post('update')
  update(@Body() body: { diary: DiaryEntity }) {
    console.log('Run update()');
    const { diary } = body;
    return this.diariesService.updateDiaryDoc(diary);
  }

  @Delete('delete')
  delete(@Body() body: { id: number }) {
    console.log('Run delete()');
    const { id } = body;
    return this.diariesService.deleteDiaryDoc(id);
  }
}
