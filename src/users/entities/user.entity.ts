import { UserInfo } from '../schemas/userinfo.schema';
import { UserRecord } from '../schemas/userrecord.schema';

export class UserEntity {
  hashCode: string;
  userInfo: UserInfo;
  userRecord: UserRecord;
}

export const defaultUserEntity: UserEntity = {
  hashCode: '',
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
