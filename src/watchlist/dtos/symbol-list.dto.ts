import { Symbol } from "src/entities/symbol.entity";

export class SymbolListDto {
    result: Symbol[];

    constructor(symbolList: Symbol[]){
      this.result = [...symbolList];
    }
  }
  