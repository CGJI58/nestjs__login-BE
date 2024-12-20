import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserInfo {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  primary: boolean;

  @Prop({ required: true })
  verified: boolean;

  @Prop({ required: true })
  visibility: string;
}
export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
