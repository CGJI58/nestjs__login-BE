export class User {
  login: boolean;
  userInfo: UserInfo;
}

export type UserInfo = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
  nickname?: string;
  diaries?: Array<IDiary>;
};

interface IDiary {
  date: string;
  title: string;
  text: string;
}
