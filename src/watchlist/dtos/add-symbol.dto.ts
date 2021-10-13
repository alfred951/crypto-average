import { IsNotEmpty, IsString } from 'class-validator';

export class AddSymbolDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;
}
