import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserInfo, UserInfoSchema } from './userinfo.schema';
import { UserRecord, UserRecordSchema } from './userrecord.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  hashCode: string;

  @Prop({ type: UserInfoSchema, required: true })
  userInfo: UserInfo;

  @Prop({ type: UserRecordSchema, required: true })
  userRecord: UserRecord;
}

export const UserSchema = SchemaFactory.createForClass(User);
