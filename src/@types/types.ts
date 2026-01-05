// users module
export interface IUserInfo {
  githubId: number;
  githubUsername: string;
}

export interface IUserRecord {
  myDiaries: Array<number>;
}

export interface IUserConfig {
  nickname: string;
  isDarkTheme: boolean;
  UIScale: 0 | 1 | 2 | 3;
}

export interface IUserEntity {
  userInfo: IUserInfo;
  userRecord: IUserRecord;
  userConfig: IUserConfig;
  synchronized: boolean;
}

export interface MyDiaryParam {
  userId: number;
  diaryId: string;
}

// diaries module
export interface IDiaryEntity {
  diaryId?: string;
  userId?: number;
  dateValue?: Array<number>;
  title?: string;
  text?: string;
}

//auth module
export type JwtPayload = {
  githubId: number;
};
