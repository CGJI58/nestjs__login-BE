import { Injectable } from '@nestjs/common';
import { User, UserInfo } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async login(ghCode: string) {
    const baseUrl = 'https://github.com/login/oauth/access_token';
    const config = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: ghCode,
    };
    const params = new URLSearchParams(config).toString();
    const accessTokenReqestURL = `${baseUrl}?${params}`;

    const accessTokenReqest = await (
      await fetch(accessTokenReqestURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })
    ).json();

    if ('access_token' in accessTokenReqest) {
      const { access_token: accessToken } = accessTokenReqest;
      const userInfo = await (
        await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        })
      ).json();
      this.users.push({
        ghCode,
        accessToken,
        userInfo: userInfo[0],
        id: '1234',
      });
      console.log('login 완료 직후의 users[0]:', this.users[0]);
    }
  }

  getUser(ghCode: string): UserInfo {
    const { userInfo } = this.users.find((user) => user.ghCode === ghCode);
    console.log('users[]에서 ghCode 비교로 찾은 user의 userInfo:', userInfo);
    return userInfo;
  }
}
