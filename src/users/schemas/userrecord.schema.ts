import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Diary {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  text: string;
}

@Schema()
export class UserRecord {
  @Prop({ type: Array<Diary>, default: [] })
  diaries: Array<Diary>;
}

export const UserRecordSchema = SchemaFactory.createForClass(UserRecord);
