import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  getAll(): User[] {
    return this.users;
  }

  async create(ghCode: string) {
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
        await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        })
      ).json();
      this.users.push({
        accessToken,
        userInfo,
      });
      console.log(userInfo);
    }
  }

  getUser(userId: string): User {
    return this.users.find((user) => user.userInfo.id === +userId);
  }
}
