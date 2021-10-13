import { CryptoSymbol } from 'src/entities/symbol.entity';

export class SymbolListDto {
  result: CryptoSymbol[];

  constructor(symbolList: CryptoSymbol[]) {
    this.result = [...symbolList];
  }
}
