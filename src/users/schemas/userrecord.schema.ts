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
export class UserRecord {
  @Prop({ type: String, default: '' })
  nickname: string;

  @Prop({ type: Array<Diaries>, default: [] })
  diaries: Array<Diaries>;
}

export const UserRecordSchema = SchemaFactory.createForClass(UserRecord);
