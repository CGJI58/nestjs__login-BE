import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserConfig {
  @Prop({ required: true, default: '', unique: true })
  nickname: string;

  @Prop({ required: true, default: false })
  isDarkTheme: boolean;
}
export const UserConfigSchema = SchemaFactory.createForClass(UserConfig);
