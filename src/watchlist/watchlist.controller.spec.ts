import { Test, TestingModule } from '@nestjs/testing';
import { CryptoSymbol } from 'src/entities/symbol.entity';
import { AverageLectureDto } from './dtos/average-lectures.dto';
import { SymbolListDto } from './dtos/symbol-list.dto';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';

describe('WatchlistController', () => {
  let watchlistController: WatchlistController;

  beforeEach(async () => {
    const mockWatchlistService: Partial<WatchlistService> = {
      addSymbol: (symbol: string) =>
        Promise.resolve({ symbol: symbol } as CryptoSymbol),
      findAllPairs: () =>
        Promise.resolve({
          result: [
            {
              symbol: 'BTCUSDT',
            },
            {
              symbol: 'ETHUSDT',
            },
            {
              symbol: 'SOLUSDT',
            },
          ],
        } as SymbolListDto),
      addLecture: (symbol: string, lecture: number) =>
        Promise.resolve({
          symbol: symbol,
          lectures: [lecture],
        } as CryptoSymbol),
      getAverageLectures: (symbol: string, numberOfLectures: number) =>
        Promise.resolve({
          average: 50,
          numberOfLectures: numberOfLectures,
        } as AverageLectureDto),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WatchlistController],
      providers: [
        { provide: WatchlistService, useValue: mockWatchlistService },
      ],
    }).compile();

    watchlistController = app.get<WatchlistController>(WatchlistController);
  });

  it('should be defined', () => {
    expect(watchlistController.listPairs()).toBeDefined();
  });

  describe('(GET)/pairs', () => {
    it('should return all pairs that exist', async () => {
      const symbolPairs = await watchlistController.listPairs();
      expect(symbolPairs.result).toHaveLength(3);
    });
  });

  describe('(POST)/lecture', () => {
    const symbol = 'BTCUSDT';
    const lecture = 50;
    it('should include the newly added lecture', async () => {
      const updatedSymbol = await watchlistController.addLecture({
        symbol,
        lecture,
      });
      expect(updatedSymbol.lectures).toContain(lecture);
    });
  });

  describe('(POST)/pairs', () => {
    const symbol = 'BTCUSDT';
    it('should create the same symbol received', async () => {
      const createdSymbol = await watchlistController.addSymbol({ symbol });
      expect(createdSymbol.symbol).toEqual(symbol);
    });
  });

  describe('(GET)/average', () => {
    const symbol = 'BTCUSDT';
    const numberOfLectures = 50;
    it('should match the number of lectures in request', async () => {
      const averageLecture = await watchlistController.averagePrice(
        symbol,
        numberOfLectures,
      );
      expect(averageLecture.numberOfLectures).toEqual(numberOfLectures);
    });
  });
});
