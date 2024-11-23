import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

export interface IGetUser {
  userinfo: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  getAll(): User[] {
    return this.users;
  }

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
        userInfo,
        id: '1234',
      });
      console.log('this.users[0]:', this.users[0]);
    }
  }

  getUser(ghCode: string): IGetUser {
    console.log('this.users:', this.users);
    const target = this.users.find((user) => user.ghCode === ghCode);
    console.log('target:', target);
    return { userinfo: 'test string from getUser()' };
  }
}
