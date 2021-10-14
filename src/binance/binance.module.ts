import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BinanceService } from 'src/binance/binance.service';

@Module({
  imports: [HttpModule],
  providers: [BinanceService],
  exports: [BinanceService],
})
export class BinanceModule {}
