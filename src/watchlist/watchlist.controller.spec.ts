import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';

describe('WatchlistController', () => {
  let watchlistController: WatchlistController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WatchlistController],
      providers: [WatchlistService],
    }).compile();

    watchlistController = app.get<WatchlistController>(WatchlistController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(watchlistController.listPairs()).toBe('Hello World!');
    });
  });
});
