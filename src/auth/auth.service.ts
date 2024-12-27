import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserInfo } from 'src/users/schemas/userinfo.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

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

    const user = await this.usersService.getUserByEmail(userInfo.email);
    // this.authService.generateJWT(user, res);

    if (user.userInfo.email !== '') {
      console.log(`Load user data. email: ${user.userInfo.email}`);
      //여기서는 쿠키만 보내주고, user 정보는 get-user-by-cookie 가 실행될 때 보내준다.
    } else {
      const newUser: UserEntity = { ...user, userInfo };
      console.log(
        `Create user and load user data. email: ${newUser.userInfo.email}`,
      );
      this.usersService.saveUser(newUser);
      //여기서는 쿠키만 보내주고, user 정보는 get-user-by-cookie 가 실행될 때 보내준다.
    }
  }

  generateJWT(user: UserEntity, res: Response) {
    const payload = { sub: user.userInfo.email };
    const jwt = this.jwtService.sign(payload);
    res.cookie('jwt', jwt, { httpOnly: true, maxAge: 3600000 });
    console.log('cookie set');
  }

  loginByCookie() {
    console.log('여기서 쿠키로 사용자 인증 후 사용자 정보 반환.');
  }

  deleteCookie() {
    console.log('여기서 쿠키 삭제.');
  }
}
