import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { BinanceService } from './binance.service';
import * as nock from 'nock';

describe('BinanceService', () => {
  let service: BinanceService;
  const symbol = 'BTCUSDT';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinanceService],
      imports: [HttpModule],
    }).compile();

    service = module.get<BinanceService>(BinanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Check Symbol Method', () => {
    it('should give back the same symbol passed as parameter', async () => {
      nock(`https://api.binance.com/api/v3`)
        .get(`/exchangeInfo?symbol=${symbol}`)
        .reply(200, { symbols: symbol });
      const response = await service.checkSymbol(symbol);
      expect(response.symbols).toEqual(symbol);
    });

    it('should throw error in case of invalid parameter', async () => {
      nock(`https://api.binance.com/api/v3`)
        .get(`/exchangeInfo?symbol=`)
        .reply(400);
      try {
        await service.checkSymbol('');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Get Average Price Method', () => {
    it('should be able to retrieve price', async () => {
      nock(`https://api.binance.com/api/v3`)
        .get(`/avgPrice?symbol=${symbol}`)
        .reply(200, { price: 50 });
      const response = await service.getAveragePrice(symbol);
      expect(response.price).toEqual(50);
    });

    it('should return error in case of invalid parameter', async () => {
      nock(`https://api.binance.com/api/v3`)
        .get(`/avgPrice?symbol=`)
        .reply(400);
      try {
        await service.getAveragePrice('');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
