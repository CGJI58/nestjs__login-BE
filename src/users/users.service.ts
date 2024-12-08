import { Injectable } from '@nestjs/common';
import { User, UserInfo } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

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
    const user = { login: true, userInfo };
    //user가 이미 존재하는지 확인해서, 있으면 login:true만들어서 updateUser,
    //없으면 새로 만드는 로직 여기다가 만들 것.
    this.users.push(user);
    return user;
  }

  getUser(email: string): User {
    const user = this.users.find((user) => user.userInfo.email === email);
    return user;
  }

  deleteUser(email: string) {
    this.users = this.users.filter((user) => user.userInfo.email !== email);
  }

  updateUserState(user: User) {
    this.deleteUser(user.userInfo.email);
    this.users.push(user);
  }
}
