import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { AveragePriceDto } from './dtos/average-price.dto';
import { ExchangeInfoDto } from './dtos/exchange-info.dto';

@Injectable()
export class BinanceService {
  constructor(private httpService: HttpService) {}

  /**
   * Calls the BinanceAPI to verify the existance of a given symbol
   *
   * @param {string} Symbol  The symbol for which we want to check if it exists in Binance
   * @returns {ExchangeInfoDto} A response data object with either an error code or the symbol
   */
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

  /**
   * Calls the BinanceAPI to fetch the current average price of a given symbol
   *
   * @param {string} Symbol  The symbol for which we want to fetch the current price
   * @returns {AveragePriceDto} A response data object with the price or an error code
   */
  async getAveragePrice(symbol: string): Promise<AveragePriceDto> {
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
