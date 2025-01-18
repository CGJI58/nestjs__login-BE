import { UserInfo } from '../schemas/userinfo.schema';
import { UserRecord } from '../schemas/userrecord.schema';

export class UserEntity {
  userInfo: UserInfo;
  userRecord: UserRecord;
}
