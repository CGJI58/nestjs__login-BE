import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Diary, DiaryDocument } from './schemas/diary.schema';
import { Model } from 'mongoose';
import { DiaryEntity } from './entities/diary.entity';

@Injectable()
export class DiariesService {
  constructor(
    @InjectModel(Diary.name) private diaryModel: Model<DiaryDocument>,
  ) {}

  async getDiaryEntities(): Promise<Array<DiaryEntity>> {
    const diaryEntities = await this.diaryModel
      .find({}, { _id: 0, __v: 0 })
      .sort({ id: -1 })
      .lean<Array<DiaryEntity>>();
    return diaryEntities;
  }

  async findDiaryDoc(id: number): Promise<DiaryDocument | null> {
    const diaryDoc = this.diaryModel.findOne({ id });
    return diaryDoc;
  }

  async saveDiaryDoc(diary: DiaryEntity): Promise<{ saveDone: boolean }> {
    const checkDiaryDB = await this.findDiaryDoc(diary.id);
    if (checkDiaryDB === null) {
      console.log('save diary');
      const newDiaryModel = new this.diaryModel(diary);
      await newDiaryModel.save();
      return { saveDone: true };
    } else {
      throw new Error('Diary already exists in DB. (duplicated id)');
    }
  }

  async deleteDiaryDoc(id: number): Promise<{ deleteDone: boolean }> {
    const deleteResult = await this.diaryModel.deleteOne({ id }).exec();
    if (deleteResult.deletedCount === 1) {
      console.log('delete diary successfully.');
      return { deleteDone: true };
    } else {
      console.log(`delete diary failed. No matched diary in DB. id: ${id}`);
      return { deleteDone: false };
    }
  }

  async updateDiaryDoc(diary: DiaryEntity): Promise<{ updateDone: boolean }> {
    await this.deleteDiaryDoc(diary.id);
    const { saveDone: updateDone } = await this.saveDiaryDoc(diary);
    return { updateDone };
  }
}
