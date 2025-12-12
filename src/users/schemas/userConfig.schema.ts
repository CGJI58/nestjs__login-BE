import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserConfig {
  @Prop({ required: true, default: '', unique: true })
  nickname: string;

  @Prop({ required: true, default: false })
  isDarkTheme: boolean;

  @Prop({ required: true, default: 1 })
  UIScale: 0 | 1 | 2 | 3;
}
export const UserConfigSchema = SchemaFactory.createForClass(UserConfig);
