import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserEntity(email: string): Promise<UserEntity | null> {
    const userEntity = await this.userModel
      .findOne({ 'userInfo.email': email }, { _id: 0 })
      .lean<UserEntity>();
    if (!userEntity) {
      return null;
    }
    return { ...userEntity, synchronized: true };
  }

  async findUserDoc(email: string): Promise<UserDocument | null> {
    const userDoc = this.userModel.findOne({ 'userInfo.email': email });
    return userDoc;
  }

  async saveUserDoc(user: UserEntity): Promise<void> {
    const checkUserDB = await this.findUserDoc(user.userInfo.email);
    if (checkUserDB === null) {
      console.log('save user');
      const newUserModel = new this.userModel(user);
      await newUserModel.save();
    } else {
      throw new Error('User already exists in DB. (duplicated email)');
    }
  }

  async deleteUserDoc(email: string) {
    const deleteResult = await this.userModel
      .deleteOne({ 'userInfo.email': email })
      .exec();
    if (deleteResult.deletedCount === 1) {
      console.log('delete user successfully.');
    } else {
      console.log(`delete user failed. No matched user in DB. email: ${email}`);
    }
  }

  async updateUserDoc(user: UserEntity): Promise<void> {
    await this.deleteUserDoc(user.userInfo.email);
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
}
