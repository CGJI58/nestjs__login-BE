import { IsBoolean, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly userName: string;

  @IsBoolean()
  readonly logIn: boolean;
}
