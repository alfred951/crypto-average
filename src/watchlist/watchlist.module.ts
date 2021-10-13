import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BinanceService } from 'src/binance/binance.service';
import { CryptoSymbol } from '../entities/symbol.entity';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([CryptoSymbol]), HttpModule],
  controllers: [WatchlistController],
  providers: [WatchlistService, BinanceService],
})
export class WatchlistModule {}
