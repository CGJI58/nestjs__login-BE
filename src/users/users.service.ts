import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserEntity } from './entities/user.entity';
import { MyDiaryParam } from 'src/@types/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUserEntity(githubId: number): Promise<UserEntity | null> {
    const userEntity = await this.userModel
      .findOne({ 'userInfo.githubId': githubId }, { _id: 0 })
      .lean<UserEntity>();
    if (!userEntity) {
      return null;
    }
    return { ...userEntity, synchronized: true };
  }

  async findUserDoc(githubId: number): Promise<UserDocument | null> {
    const userDoc = await this.userModel.findOne({
      'userInfo.githubId': githubId,
    });
    return userDoc;
  }

  async saveUserDoc(user: UserEntity): Promise<void> {
    const checkUserDB = await this.findUserDoc(user.userInfo.githubId);
    if (checkUserDB === null) {
      console.log('save user');
      const newUserModel = new this.userModel(user);
      await newUserModel.save();
    } else {
      throw new Error('User already exists in DB. (duplicated githubId)');
    }
  }

  async deleteUserDoc(githubId: number) {
    const deleteResult = await this.userModel
      .deleteOne({ 'userInfo.githubId': githubId })
      .exec();
    if (deleteResult.deletedCount === 1) {
      console.log('delete user successfully.');
    } else {
      console.log(
        `delete user failed. No matched user in DB. githubId: ${githubId}`,
      );
    }
  }

  async updateUserDoc(user: UserEntity): Promise<void> {
    await this.deleteUserDoc(user.userInfo.githubId);
    await this.saveUserDoc(user);
  }

  async validateNickname(nickname: string): Promise<boolean> {
    if (!nickname) {
      throw new BadRequestException('Nickname parameter is required');
    }
    try {
      console.log('nickname:', nickname);
      const duplicated = (await this.userModel.findOne({
        'userConfig.nickname': nickname,
      }))
        ? true
        : false;
      console.log('duplicated:', duplicated);
      return !duplicated; // duplicated가 true면 false를 반환하여 사용 불가 판정
    } catch (error) {
      console.error('Error validating nickname:', error);
      throw new InternalServerErrorException('Failed to validate nickname');
    }
  }

  async addMyDiary({ userId, diaryId }: MyDiaryParam) {
    const userDoc = await this.findUserDoc(userId);
    if (userDoc) {
      userDoc.userRecord.myDiaries.push(diaryId);
      await userDoc.save();
    }
  }

  async deleteMyDiary({ userId, diaryId }: MyDiaryParam) {
    const userDoc = await this.findUserDoc(userId);
    if (userDoc) {
      userDoc.userRecord.myDiaries = userDoc.userRecord.myDiaries.filter(
        (id: string) => id !== diaryId,
      );
      await userDoc.save();
    }
  }
}
