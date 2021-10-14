import { Test, TestingModule } from '@nestjs/testing';
import { randomInt } from 'crypto';
import { BinanceModule } from 'src/binance/binance.module';
import { AveragePriceDto } from 'src/binance/dtos/average-price.dto';
import { ExchangeInfoDto } from 'src/binance/dtos/exchange-info.dto';
import { BinanceService } from 'src/binance/binance.service';
import { WatchlistService } from './watchlist.service';
import { CryptoSymbol } from 'src/entities/symbol.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { json } from 'stream/consumers';
import { SymbolListDto } from './dtos/symbol-list.dto';

export type MockType<T> = {
    [P in keyof T]?: jest.Mock<{}>;
};

describe('WatchlistService', () => {
  let service: WatchlistService;
  let repositoryMock: MockType<Repository<CryptoSymbol>>;
  const testSymbol = 'SOLUSDT';
  let symbolList: CryptoSymbol[] = [{ id: 1, symbol: testSymbol, lectures: [] }];

  beforeEach(async () => {
    const repositoryMockFactory: () => MockType<Repository<CryptoSymbol>> = jest.fn(() => ({
        findOne: jest.fn((querySymbol: string | any) => {
            if(querySymbol.where){
                querySymbol = querySymbol.where.symbol;
            }
            const response = symbolList.find(({ symbol }) => symbol === querySymbol);
            return response;
        }),
        find: jest.fn(() => {
            return symbolList;
        }),
        create: jest.fn((querySymbol: string | any) => {
            if(querySymbol.symbol){
                querySymbol = querySymbol.symbol;
            }
            const symbol: CryptoSymbol = {id: 1, symbol: querySymbol, lectures: []};
            return symbol;
        }),
        save: jest.fn((newSymbol : CryptoSymbol) => {
            let symbolIndex = symbolList.findIndex((cryptoSymbol => cryptoSymbol.symbol == newSymbol.symbol));
            if(symbolIndex == -1){
                symbolList.push(newSymbol);
            } else {
                symbolList[symbolIndex].lectures = [...newSymbol.lectures]
            }
            return newSymbol;
        }),
    }));
    const mockBinanceService: Partial<BinanceService> = {
      checkSymbol: (symbol: string) =>
        Promise.resolve({ symbols: symbol } as ExchangeInfoDto),
      getAveragePrice: () => {
        return Promise.resolve({ price: randomInt(50) } as AveragePriceDto);
    }};
    const module: TestingModule = await Test.createTestingModule({
      imports: [BinanceModule],
      providers: [WatchlistService,
        { provide: getRepositoryToken(CryptoSymbol), useFactory: repositoryMockFactory },
      ],
    })
      .overrideProvider(BinanceService)
      .useValue(mockBinanceService)
      .compile();

    service = module.get<WatchlistService>(WatchlistService);
    repositoryMock = module.get(getRepositoryToken(CryptoSymbol));
  });


  describe('getWatchlistLecture method', () => {
    it('should add a lecture to every symbol', async () => {
        await service.getWatchlistLecture();
        const symbol = repositoryMock.findOne(testSymbol) as CryptoSymbol;
        expect(symbol.lectures.length).toBeDefined;
    });
  });

  describe('findAllPairs method', () => {
    it('should return all pairs that exist', async () => {
        const symbol = 'XRPUSDT';
        await service.addSymbol(symbol);
        const resultList = await service.findAllPairs() as SymbolListDto;
        expect(resultList.result.length).toEqual(symbolList.length);
    });
  });

  describe('addSymbol method', () => {
    it('should find the recently created symbol', async () => {
        const symbol = 'BTCUSDT';
        await service.addSymbol(symbol);
        expect(repositoryMock.findOne(symbol)).toBeDefined();
    });
    it('should throw an error when triying to add a duplicate symbol', async () => {
        const symbol = 'BTCUSDT';
        try {
            await service.addSymbol(symbol);
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
  });

  describe('addLecture method', () => {
    it('should add a lectures without deleting previous ones', async () => {
        await service.addLecture(testSymbol, 50);
        const symbol = repositoryMock.findOne(testSymbol) as CryptoSymbol;
        expect(symbol.lectures.length).toBeGreaterThan(0);
    });
  });

  describe('getAverageLectures method', () => {
    const averageSymbol = 'DOTUSDT';
    it('should return the correct average', async () => {
        await service.addSymbol(averageSymbol);
        await service.addLecture(averageSymbol, 100);
        await service.addLecture(averageSymbol, 50);
        expect((await service.getAverageLectures(averageSymbol,2)).average).toEqual(75);
    });
    it('should return the maximum number of lectures', async () => {
        expect((await service.getAverageLectures(averageSymbol,10)).numberOfLectures).toEqual(2);
    });
  });

});
