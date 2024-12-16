import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  generateTokenRequestURL(ghCode: string) {
    const baseUrl = 'https://github.com/login/oauth/access_token';
    const config = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: ghCode,
    };
    const params = new URLSearchParams(config).toString();

    return `${baseUrl}?${params}`;
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
    return accessTokenReqest['access_token'];
  }

  async getUserInfo(accessToken: string) {
    const response = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    const userInfo = (await response.json())[0];
    return userInfo;
  }

  async login(ghCode: string) {
    const tokenRequestURL = this.generateTokenRequestURL(ghCode);
    const accessToken = await this.getAccessToken(tokenRequestURL);
    const userInfo = await this.getUserInfo(accessToken);

    const { email } = userInfo;
    let user = await this.getUser(email);

    if (user) {
      user.login = true;
    } else {
      user = new this.userModel({ login: true, userInfo });
    }

    await user.save();
    return user;
  }

  async getUser(email: string) {
    const user = await this.userModel
      .findOne({ 'userInfo.email': email })
      .exec();
    return user;
  }

  async deleteUser(email: string): Promise<void> {
    await this.userModel.deleteOne({ 'userInfo.email': email }).exec();
  }

  async updateUserState(user: User): Promise<void> {
    await this.deleteUser(user.userInfo.email);
    const newUser = new this.userModel(user);
    await newUser.save();
  }
}
