import { IsNotEmpty, IsNumber } from 'class-validator';

export class AverageLectureDto {
  @IsNumber()
  @IsNotEmpty()
  average: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfLectures: number;
}
