import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Diaries {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  text: string;
}

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

  @Prop()
  nickname?: string;

  @Prop({ type: Array<Diaries>, default: [] })
  diaries?: Array<Diaries>;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
