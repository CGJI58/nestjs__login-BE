import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DiaryDocument = Diary & Document;

@Schema()
export class Diary {
  @Prop({ required: true, index: true })
  id: number;

  @Prop({ required: true })
  writer: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  text: string;
}

export const DiarySchema = SchemaFactory.createForClass(Diary);
