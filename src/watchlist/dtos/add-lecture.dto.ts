import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class AddLectureDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  lecture: number;
}
