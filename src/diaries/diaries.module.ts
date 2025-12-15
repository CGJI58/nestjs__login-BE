import { Module } from '@nestjs/common';
import { DiariesController } from './diaries.controller';
import { DiariesService } from './diaries.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Diary, DiarySchema } from './schemas/diary.schema';

@Module({
  controllers: [DiariesController],
  providers: [DiariesService],
  imports: [
    MongooseModule.forFeature([{ name: Diary.name, schema: DiarySchema }]),
  ],
})
export class DiariesModule {}
