import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserConfig {
  @Prop({ required: true, default: '', unique: true })
  nickname: string;

  @Prop({ required: true, default: false })
  isDarkTheme: boolean;

  @Prop({ required: true, default: 16 })
  fontSize: number;
}
export const UserConfigSchema = SchemaFactory.createForClass(UserConfig);
