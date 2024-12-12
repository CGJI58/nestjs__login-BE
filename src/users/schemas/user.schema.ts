import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserInfo, UserInfoSchema } from './userinfo.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  login: boolean;

  @Prop({ type: UserInfoSchema, required: true })
  userInfo: UserInfo;
}

export const UserSchema = SchemaFactory.createForClass(User);
