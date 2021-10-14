import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BinanceModule } from 'src/binance/binance.module';
import { CryptoSymbol } from '../entities/symbol.entity';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CryptoSymbol]),
    HttpModule,
    BinanceModule,
  ],
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule {}
