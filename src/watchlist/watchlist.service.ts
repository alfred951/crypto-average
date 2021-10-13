import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Symbol } from '../entities/symbol.entity';
import { SymbolListDto } from './dtos/symbol-list.dto';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Symbol) private readonly symbolRepository: Repository<Symbol>,
  ) {}

  public async findAll(): Promise<SymbolListDto> {
    const symbolList = await this.symbolRepository.find();
    const result = new SymbolListDto(symbolList);
    return result;
  }

  public async addSymbol(symbol: string): Promise<Symbol> {
    const newSymbol = this.symbolRepository.create({symbol:symbol})
    return await this.symbolRepository.save(newSymbol);
  }
}
