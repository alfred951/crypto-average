import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Symbol } from '../entities/symbol.entity';
import { AddLectureDto } from './dtos/add-lecture.dto';
import { AddSymbolDto } from './dtos/add-symbol.dto';
import { AverageLectureDto } from './dtos/average-lectures.dto';
import { SymbolListDto } from './dtos/symbol-list.dto';
import { WatchlistService } from './watchlist.service';

@Controller()
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post('pairs')
  addSymbol(@Body() addSymbolDto: AddSymbolDto): Promise<Symbol> {
    return this.watchlistService.addSymbol(addSymbolDto.symbol);
  }

  @Post('lecture')
  addLecture(@Body() AddLectureDto: AddLectureDto): Promise<Symbol> {
    return this.watchlistService.addLecture(AddLectureDto.symbol, AddLectureDto.lecture);
  }

  @Get('pairs')
  listPairs(): Promise<SymbolListDto> {
    return this.watchlistService.findAll();
  }

  @Get('average')
  averagePrice(@Query('symbol') symbol: string, @Query('lectures') lectures: number): Promise<AverageLectureDto> {
    return this.watchlistService.getAverageLectures(symbol, lectures);
  }

}
