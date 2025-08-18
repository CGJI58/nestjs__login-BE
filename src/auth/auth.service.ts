import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
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

    let user = await this.usersService.getUserByEmail(userInfo.email);
    if (!user) {
      console.log('Create user.');
      user = {
        userInfo,
        userRecord: { diaries: [] },
        userConfig: {
          nickname: '사용자',
          isDarkTheme: false,
          fontSize: 16,
        },
        synchronized: true,
      };
      await this.usersService.saveUser(user);
    }
    return this.generateJWT(user);
  }

  generateJWT(user: UserEntity): { jwt: string; user: UserEntity } {
    const payload = { sub: user.userInfo.email };
    const jwt = this.jwtService.sign(payload);
    return { jwt, user };
  }

  async decodeJWT(jwt: string): Promise<string> {
    try {
      const decoded = this.jwtService.verify(jwt);
      return decoded.sub;
    } catch (error) {
      console.error('Invalid jwt:', error);
      throw new UnauthorizedException('Invalid jwt');
    }
  }
}
