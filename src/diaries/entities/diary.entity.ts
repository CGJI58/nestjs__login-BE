import { Expose } from 'class-transformer';
import { IsInt, IsString, MinLength } from 'class-validator';
import { IDiaryEntity } from 'src/@types/types';

//get diary
export class GetDiaryResDto implements IDiaryEntity {
  @Expose()
  diaryId: string;

  @Expose()
  userId: number;

  @Expose()
  dateValue: Array<number>;

  @Expose()
  title: string;

  @Expose()
  text: string;
}

//create diary
export class CreateDiaryReqDto implements IDiaryEntity {
  @IsInt()
  userId: number;

  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  text: string;
}

export class UpdateDiaryReqDto implements IDiaryEntity {
  @IsString()
  diaryId: string;

  @IsInt()
  userId: number;

  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  text: string;
}
