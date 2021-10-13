import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Symbol } from '../entities/symbol.entity';
import { SymbolListDto } from './dtos/symbol-list.dto';
import { WatchlistService } from './watchlist.service';

@Controller()
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post('pairs')
  addSymbol(@Body() body: {symbol: string}): Promise<Symbol> {
    return this.watchlistService.addSymbol(body.symbol);
  }

  @Get('pairs')
  listPairs(): Promise<SymbolListDto> {
    return this.watchlistService.findAll();
  }

  @Get('average')
  averagePrice(@Param('symbol') symbol: string): string {
    return; //this.appService.getHello();
  }

}
