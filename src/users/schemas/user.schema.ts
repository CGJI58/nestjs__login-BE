import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserInfo, UserInfoSchema } from './userinfo.schema';
import { UserRecord, UserRecordSchema } from './userrecord.schema';
import { UserConfig, UserConfigSchema } from './userConfig.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: UserInfoSchema, required: true })
  userInfo: UserInfo;

  @Prop({ type: UserRecordSchema, required: true })
  userRecord: UserRecord;

  @Prop({ type: UserConfigSchema, required: true })
  userConfig: UserConfig;

  @Prop({ required: true })
  synchronized: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
