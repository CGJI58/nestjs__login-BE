import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserInfo {
  @Prop({ required: true, default: '', unique: true })
  githubId: number;

  @Prop({ required: true, default: false })
  githubUsername: string;
}
export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
