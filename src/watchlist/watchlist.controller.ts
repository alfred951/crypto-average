import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CryptoSymbol } from '../entities/symbol.entity';
import { AddLectureDto } from './dtos/add-lecture.dto';
import { AddSymbolDto } from './dtos/add-symbol.dto';
import { AverageLectureDto } from './dtos/average-lectures.dto';
import { SymbolListDto } from './dtos/symbol-list.dto';
import { WatchlistService } from './watchlist.service';

@Controller()
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  /**
   * @example
   * (POST) /pairs body{symbol : ETHUSDT}
   */
  @Post('pairs')
  addSymbol(@Body() addSymbolDto: AddSymbolDto): Promise<CryptoSymbol> {
    return this.watchlistService.addSymbol(addSymbolDto.symbol);
  }

  /**
   * @example
   * (POST) /lecture body{symbol : ETHUSDT, lecture : 20.32}
   */
  @Post('lecture')
  addLecture(@Body() addLectureDto: AddLectureDto): Promise<CryptoSymbol> {
    return this.watchlistService.addLecture(
      addLectureDto.symbol,
      addLectureDto.lecture,
    );
  }

  /**
   * @example
   * (GET) /pairs
   */
  @Get('pairs')
  listPairs(): Promise<SymbolListDto> {
    return this.watchlistService.findAllPairs();
  }

  /**
   * @example
   * (GET) /average?symbol=ETHUSDT&lectures=10
   */
  @Get('average')
  averagePrice(
    @Query('symbol') symbol: string,
    @Query('lectures') lectures: number,
  ): Promise<AverageLectureDto> {
    return this.watchlistService.getAverageLectures(symbol, lectures);
  }
}
