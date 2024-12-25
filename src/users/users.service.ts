import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserInfo } from './schemas/userinfo.schema';
import { defaultUserEntity, UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  generateAccessTokenRequestURL(ghCode: string): string {
    const baseUrl = 'https://github.com/login/oauth/access_token';
    const [clientId, clientSecret] = [
      process.env.LOCALHOST_CLIENT_ID,
      process.env.LOCALHOST_CLIENT_SECRET,
    ];
    if (clientId && clientSecret) {
      const config = {
        client_id: clientId,
        client_secret: clientSecret,
        code: ghCode,
      };
      const params = new URLSearchParams(config).toString();

      return `${baseUrl}?${params}`;
    } else {
      throw new Error('Cannot get clientId or clientSecret.');
    }
  }

  async getAccessToken(url: string) {
    const accessTokenReqest = await (
      await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })
    ).json();
    const accessToken = accessTokenReqest['access_token'];
    if (typeof accessToken === 'string') {
      return accessToken;
    } else {
      throw new Error('Cannot get accessToken from github O Auth app.');
    }
  }

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    try {
      const response = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });
      const userInfo: UserInfo = (await response.json())[0];
      return userInfo;
    } catch {
      throw new Error('Cannot get userinfo from github.');
    }
  }

  async loginByGhCode(ghCode: string) {
    const tokenRequestURL = this.generateAccessTokenRequestURL(ghCode);
    const accessToken = await this.getAccessToken(tokenRequestURL);
    const userInfo = await this.getUserInfo(accessToken);
    const user = await this.getUserByEmail(userInfo.email);

    if (user) {
      console.log('loginByGhCode: User already exists. Load user data.');
    } else {
      console.log('loginByGhCode: User not exists. Create new user data.');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const target = await this.userModel
      .findOne({ 'userInfo.email': email })
      .exec();
    if (target) {
      const { userInfo, userRecord } = target;
      const user: UserEntity = { userInfo, userRecord };
      return user;
    } else {
      console.log('getUserByEmail: Cannot find user in DB. OK to save user.');
      return defaultUserEntity;
    }
  }

  async saveUser(user: UserEntity): Promise<void> {
    const checkUserDB = await this.getUserByEmail(user.userInfo.email);
    if (checkUserDB === null) {
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
