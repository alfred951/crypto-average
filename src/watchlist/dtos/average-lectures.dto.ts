import { IsNumber } from 'class-validator';

export class AverageLectureDto {
  @IsNumber()
  average: number;

  @IsNumber()
  numberOfLectures: number;
}
