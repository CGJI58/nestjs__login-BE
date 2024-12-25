import { UserInfo } from '../schemas/userinfo.schema';
import { UserRecord } from '../schemas/userrecord.schema';

export class UserEntity {
  userInfo: UserInfo;
  userRecord: UserRecord;
}

export const defaultUserEntity: UserEntity = {
  userInfo: {
    email: '',
    primary: false,
    verified: false,
    visibility: '',
  },
  userRecord: {
    nickname: '',
    diaries: [],
  },
};
