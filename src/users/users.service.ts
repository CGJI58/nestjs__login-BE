import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  removeIdKey(userObject: any) {
    if ('_id' in userObject) {
      const { _id, ...rest } = userObject;
      return { ...rest };
    }
    return userObject;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    let targetArray = await this.userModel
      .aggregate([
        { $match: { 'userInfo.email': email } },
        {
          $project: {
            _id: 0,
            'userInfo._id': 0,
            'userRecord._id': 0,
            'userConfig._id': 0,
          },
        },
      ])
      .exec();
    let target: UserEntity | null =
      targetArray.length > 0 ? targetArray[0] : null;
    if (target) {
      const { userInfo, userRecord, userConfig } = target;
      const cleanedTarget: UserEntity = {
        userInfo: ((userInfo) => this.removeIdKey(userInfo))(userInfo),
        userRecord: ((userRecord) => this.removeIdKey(userRecord))(userRecord),
        userConfig: ((userConfig) => this.removeIdKey(userConfig))(userConfig),
        synchronized: true,
      };
      return cleanedTarget;
    } else {
      return null;
    }
  }

  async saveUser(user: UserEntity): Promise<void> {
    const checkUserDB = await this.getUserByEmail(user.userInfo.email);
    if (!checkUserDB) {
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
