import {
  IUserConfig,
  IUserEntity,
  IUserInfo,
  IUserRecord,
} from 'src/@types/types';

export class UserEntity implements IUserEntity {
  userInfo: IUserInfo;
  userRecord: IUserRecord;
  userConfig: IUserConfig;
}

export class UpdateUserConfigReq implements IUserEntity {
  userConfig: IUserConfig;
}

export class getUserEntityResDto implements IUserEntity {
  userInfo: IUserInfo;
  userRecord: IUserRecord;
  userConfig: IUserConfig;
  synchronized: boolean;
}
