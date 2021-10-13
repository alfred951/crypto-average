import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddLectureDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsNumber()
  @IsNotEmpty()
  lecture: number;
}
