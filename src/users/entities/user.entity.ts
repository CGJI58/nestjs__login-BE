export type UserInfo = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
};

export class User {
  ghCode: string;
  accessToken: string;
  userInfo: UserInfo;
  id: string;
}
