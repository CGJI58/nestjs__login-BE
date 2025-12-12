import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserInfo {
  @Prop({ required: true, default: '', unique: true })
  email: string;

  @Prop({ required: true, default: false })
  primary: boolean;

  @Prop({ required: true, default: false })
  verified: boolean;

  @Prop({ required: true, default: '' })
  visibility: string;
}
export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
