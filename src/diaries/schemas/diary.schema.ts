import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DiaryDocument = HydratedDocument<Diary>;

@Schema({ timestamps: true })
export class Diary {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  text: string;

  createdAt: Date;
  updatedAt: Date;
}

export const DiarySchema = SchemaFactory.createForClass(Diary);
