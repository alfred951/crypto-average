import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoSymbol } from '../entities/symbol.entity';
import { AverageLectureDto } from './dtos/average-lectures.dto';
import { SymbolListDto } from './dtos/symbol-list.dto';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(CryptoSymbol)
    private readonly cryptoSymbolRepository: Repository<CryptoSymbol>,
  ) {}

  public async findAll(): Promise<SymbolListDto> {
    const symbolList = await this.cryptoSymbolRepository.find();
    const result = new SymbolListDto(symbolList);
    return result;
  }

  public async addSymbol(symbol: string): Promise<CryptoSymbol> {
    if (await this.getSymbol(symbol)) {
      throw new BadRequestException('Symbol already exists');
    }
    const newSymbol = this.cryptoSymbolRepository.create({ symbol: symbol });
    return await this.cryptoSymbolRepository.save(newSymbol);
  }

  public async getSymbol(symbol: string): Promise<CryptoSymbol> {
    return await this.cryptoSymbolRepository.findOne({
      where: { symbol: symbol },
    });
  }

  public async addLecture(
    querySymbol: string,
    lecture: number,
  ): Promise<CryptoSymbol> {
    const symbol = await this.getSymbol(querySymbol);
    if (!symbol) {
      throw new NotFoundException("Couldn't find the symbol");
    }
    symbol.lectures.push(lecture);
    return await this.cryptoSymbolRepository.save(symbol);
  }

  public async getAverageLectures(
    querySymbol: string,
    lectures: number,
  ): Promise<AverageLectureDto> {
    const symbol = await this.getSymbol(querySymbol);
    if (!symbol) {
      throw new NotFoundException("Couldn't find the symbol");
    }
    const lectureCount =
      symbol.lectures.length < lectures ? symbol.lectures.length : lectures;
    if (lectureCount == 0) {
      throw new NotFoundException(
        'There are no lectures available for this Symbol',
      );
    }
    const lectureSum = symbol.lectures
      .slice(symbol.lectures.length - lectureCount, symbol.lectures.length)
      .reduce((sum, average) => sum + average);
    const average = lectureSum / lectureCount;
    return { average: average, numberOfLectures: lectureCount };
  }
}
