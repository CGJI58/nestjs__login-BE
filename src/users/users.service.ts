import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { defaultUserEntity, UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserByEmail(email: string): Promise<UserEntity> {
    const target = await this.userModel
      .findOne({ 'userInfo.email': email })
      .exec();
    if (target) {
      const { userInfo, userRecord } = target;
      const user: UserEntity = { userInfo, userRecord };
      return user;
    } else {
      return defaultUserEntity;
    }
  }

  async saveUser(user: UserEntity): Promise<void> {
    const checkUserDB = await this.getUserByEmail(user.userInfo.email);
    if (checkUserDB.userInfo.email === '') {
      const newUserModel = new this.userModel(user);
      await newUserModel.save();
      console.log('save user');
    } else {
      throw new Error('User already exists in DB. (duplicated emails)');
    }
  }

  async deleteUser(email: string) {
    const result = await this.userModel
      .deleteOne({ 'userInfo.email': email })
      .exec();
    if (result.deletedCount === 1) {
      console.log('delete user successfully.');
    } else {
      console.log(`delete user failed. No matched user in DB. email: ${email}`);
    }
  }

  async updateUserDB(user: UserEntity): Promise<void> {
    await this.deleteUser(user.userInfo.email);
    await this.saveUser(user);
  }
}
