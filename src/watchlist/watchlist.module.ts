import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoSymbol } from '../entities/symbol.entity';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([CryptoSymbol])],
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule {}
