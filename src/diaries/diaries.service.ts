import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Diary, DiaryDocument } from './schemas/diary.schema';
import { Model } from 'mongoose';
import {
  GetDiaryResDto,
  CreateDiaryReqDto,
  UpdateDiaryReqDto,
} from './entities/diary.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DiariesService {
  constructor(
    @InjectModel(Diary.name) private diaryModel: Model<Diary>,
    private readonly usersService: UsersService,
  ) {}

  async getDiaryEntities(userId: number): Promise<Array<GetDiaryResDto>> {
    const diaryEntities = await this.diaryModel
      .find({ userId }, { __v: 0 })
      .sort({ updatedAt: -1 })
      .lean()
      .then((docs) =>
        docs.map(({ _id, userId, createdAt, updatedAt, title, text }) => ({
          diaryId: _id.toString(),
          userId,
          dateValue: [
            new Date(createdAt).getTime(),
            new Date(updatedAt).getTime(),
          ],
          title,
          text,
        })),
      );
    return diaryEntities;
  }

  async findDiaryDoc(diaryId: string): Promise<DiaryDocument | null> {
    return this.diaryModel.findById(diaryId).exec();
  }

  async saveDiaryDoc({
    userId,
    title,
    text,
  }: CreateDiaryReqDto): Promise<{ saveDone: boolean }> {
    try {
      // 1. diary 저장
      const newDiaryModel = new this.diaryModel({ userId, title, text });
      const diaryDoc = await newDiaryModel.save();

      // 2. userInfo.myDiaries 에 id값 추가 (비동기, 백그라운드)
      this.usersService
        .addMyDiary({
          userId,
          diaryId: diaryDoc._id.toString(),
        })
        .catch((error) => {
          console.error('Failed to add diary to user:', error);
        });

      console.log('save diary successfully.');
      return { saveDone: true };
    } catch (error) {
      console.error('Unexpected error while saving diary:', error);
      return { saveDone: false };
    }
  }

  async deleteDiaryDoc({
    diaryId,
    userId,
  }: {
    diaryId: string;
    userId: number;
  }): Promise<{ deleteDone: boolean }> {
    try {
      // 1. diaryId로 diary 조회
      const diary = await this.diaryModel.findById(diaryId).exec();
      if (!diary) {
        console.log(`delete diary failed. No diary found. diaryId: ${diaryId}`);
        return { deleteDone: false };
      }

      // 2. userId 일치 여부 확인
      if (diary.userId !== userId) {
        console.log(
          `delete diary failed. User mismatch. diary.userId=${diary.userId}, request.userId=${userId}`,
        );
        throw new UnauthorizedException(
          `User ${userId} is not authorized to delete diary ${diaryId}`,
        );
      }

      // 3. 삭제 실행
      const { acknowledged, deletedCount } = await this.diaryModel
        .deleteOne({ _id: diaryId })
        .exec();
      if (acknowledged && deletedCount > 0) {
        console.log('delete diary successfully.');

        // userInfo.myDiaries 에서 id값 제거 (비동기, 백그라운드)
        this.usersService.deleteMyDiary({ userId, diaryId }).catch((error) => {
          console.error('Failed to remove diary from user:', error);
        });

        return { deleteDone: true };
      } else {
        console.log(
          `delete diary failed. Delete operation did not succeed. diaryId: ${diaryId}`,
        );
        return { deleteDone: false };
      }
    } catch (error) {
      console.error('Unexpected error while deleting diary:', error);
      return { deleteDone: false };
    }
  }

  async updateDiaryDoc({
    diaryId,
    userId,
    title,
    text,
  }: UpdateDiaryReqDto): Promise<{ updateDone: boolean }> {
    try {
      // 1. diaryId로 diary 조회
      const diary = await this.diaryModel.findById(diaryId).exec();
      if (!diary) {
        console.log(`update diary failed. No diary found. diaryId: ${diaryId}`);
        return { updateDone: false };
      }

      // 2. userId 일치 여부 확인
      if (diary.userId !== userId) {
        console.log(
          `update diary failed. User mismatch. diary.userId=${diary.userId}, request.userId=${userId}`,
        );
        throw new UnauthorizedException(
          `User ${userId} is not authorized to update diary ${diaryId}`,
        );
      }

      // 3. title, text 갱신
      diary.title = title;
      diary.text = text;
      diary.updatedAt = new Date();

      await diary.save();

      console.log('update diary successfully.');
      return { updateDone: true };
    } catch (error) {
      console.error('Unexpected error while updating diary:', error);
      return { updateDone: false };
    }
  }
}
