import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { ExchangeInfoDto } from './dtos/exchange-info.dto';

@Injectable()
export class BinanceService {
  constructor(private httpService: HttpService) {}

  async checkSymbol(symbol: string): Promise<ExchangeInfoDto> {
    return firstValueFrom(
      this.httpService
        .get(`https://api.binance.com/api/v3/exchangeInfo?symbol=${symbol}`)
        .pipe(
          map((response) => {
            return response.data;
          }),
        ),
    );
  }

  async getAveragePrice(symbol: string): Promise<ExchangeInfoDto> {
    return firstValueFrom(
      this.httpService
        .get(`https://api.binance.com/api/v3/avgPrice?symbol=${symbol}`)
        .pipe(
          map((response) => {
            return response.data;
          }),
        ),
    );
  }
}
