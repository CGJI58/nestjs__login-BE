import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserRecord {
  @Prop({ required: true })
  myDiaries: Array<string>;
}

export const UserRecordSchema = SchemaFactory.createForClass(UserRecord);
