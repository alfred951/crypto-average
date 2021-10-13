import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Symbol } from '../entities/symbol.entity';
import { AverageLectureDto } from './dtos/average-lectures.dto';
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
    if (await this.getSymbol(symbol)) {
      throw new BadRequestException("Symbol already exists");
    }
    const newSymbol = this.symbolRepository.create({symbol:symbol})
    return await this.symbolRepository.save(newSymbol);
  }
  
  public async getSymbol(symbol: string): Promise<Symbol> {
    return await this.symbolRepository.findOne({ where: { symbol: symbol } });
  }

  public async addLecture(querySymbol: string, lecture: number): Promise<Symbol> {
    const symbol = await this.getSymbol(querySymbol);
    if (!symbol) {
      throw new NotFoundException("Couldn't find the symbol");
    }
    symbol.lectures.push(lecture);
    return await this.symbolRepository.save(symbol);
  }

  public async getAverageLectures(querySymbol: string, lectures: number): Promise<AverageLectureDto> {
    const symbol = await this.getSymbol(querySymbol);
    if (!symbol) {
      throw new NotFoundException("Couldn't find the symbol");
    }
    const lectureCount = symbol.lectures.length < lectures ? symbol.lectures.length : lectures;
    if (lectureCount == 0){
      throw new NotFoundException("There are no lectures available for this Symbol");
    }
    const lectureSum = symbol.lectures.slice(symbol.lectures.length - lectureCount, symbol.lectures.length).reduce((sum, average) => sum + average);
    const average = lectureSum / lectureCount;
    return {average: average, numberOfLectures: lectureCount}
  }
}
