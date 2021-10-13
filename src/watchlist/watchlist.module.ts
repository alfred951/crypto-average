import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Symbol } from '../entities/symbol.entity';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';

@Module({
    imports: [TypeOrmModule.forFeature([Symbol])],
    controllers: [WatchlistController],
    providers: [WatchlistService],})
export class WatchlistModule {
}
