import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { BinanceService } from 'src/binance/binance.service';
import { AveragePriceDto } from 'src/binance/dtos/average-price.dto';
import { Repository } from 'typeorm';
import { CryptoSymbol } from '../entities/symbol.entity';
import { AverageLectureDto } from './dtos/average-lectures.dto';
import { SymbolListDto } from './dtos/symbol-list.dto';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(CryptoSymbol)
    private readonly cryptoSymbolRepository: Repository<CryptoSymbol>,
    private binanceService: BinanceService,
  ) {}

  /**
   * A Cron job that runs every hour, it gets every single Symbol from the database and calls
   * the BinanceAPI to store a new lecture from it's price.
   *
   * IMPORTANT: This method is not meant to be called directly
   */
  @Cron(CronExpression.EVERY_HOUR)
  async getWatchlistLecture() {
    const whatchlistPairs = await this.cryptoSymbolRepository.find();
    whatchlistPairs.forEach(async (cryptoSymbol) => {
      const symbol = cryptoSymbol.symbol;
      let lecture: AveragePriceDto;
      try {
        lecture = await this.binanceService.getAveragePrice(symbol);
      } catch (error) {
        throw new NotFoundException(
          `Binance API encountered an error while fetching ${symbol} error: ${error}`,
        );
      }
      this.addLecture(symbol, lecture.price);
    });
  }

  /**
   * Lists all symbols in the watchlist
   *
   * @returns {SymbolListDto} A reponse object that contains the list of all symbol pairs currently in the database.
   */
  public async findAllPairs(): Promise<SymbolListDto> {
    const symbolList = await this.cryptoSymbolRepository.find();
    const result = new SymbolListDto(symbolList);
    return result;
  }

  /**
   * Adds a new symbol to the watchlist, returns an error if ti's not recogniced by Binance or if it is already
   * Present in the database
   *
   * @param {string} Symbol The symbol we want to add to the database.
   * @returns {CryptoSymbol} If the symbol was sucessfully added, returns a copy of the database object created
   * otherwise an error is trhown.
   */
  public async addSymbol(symbol: string): Promise<CryptoSymbol> {
    if (await this.getSymbol(symbol)) {
      throw new BadRequestException('Symbol already exists');
    }
    try {
      await this.binanceService.checkSymbol(symbol);
    } catch (error) {
      throw new BadRequestException(`Symbol not recogniced by Binance API`);
    }
    const newSymbol = this.cryptoSymbolRepository.create({ symbol: symbol });
    return await this.cryptoSymbolRepository.save(newSymbol);
  }

  /**
   * Finds a symbol pair by it's name in the database
   *
   * @param {string} Symbol The symbol we want to find in the database.
   * @returns {CryptoSymbol} If the symbol exists, returns object from the database.
   */
  public async getSymbol(symbol: string): Promise<CryptoSymbol> {
    return await this.cryptoSymbolRepository.findOne({
      where: { symbol: symbol },
    });
  }

  /**
   * Inserts a lecture into the lecture array of a given symbol
   *
   * IMPORTANT: this method was created for manual testing purposes
   *
   * @param {string} querySymbol The symbol we want to add a lecture to.
   * @param {number} lecture The price of the lecture to be added.
   * @returns {CryptoSymbol} If the symbol exists, returns the updated object from the database.
   */
  public async addLecture(
    querySymbol: string,
    lecture: number,
  ): Promise<CryptoSymbol> {
    const symbol = await this.getSymbol(querySymbol);
    if (!symbol) {
      throw new NotFoundException("Couldn't find the symbol");
    }
    symbol.lectures.push(lecture);
    return await this.cryptoSymbolRepository.save(symbol);
  }

  /**
   * This method looks for a symbol in the database and calculates de average of the last N readings starting from
   * the most receantly added to the oldest, in case the user request a number of lectures superior to the number
   * available it will return the average of the ones that exist and reflect said amount in the response.
   *
   * @param {string} querySymbol The symbol we want to add a lecture to.
   * @param {number} lectures The amount of lectures that want to be taken into account
   * @returns {AverageLectureDto} A response data oject with the average price and the number of readings.
   */
  public async getAverageLectures(
    querySymbol: string,
    lectures: number,
  ): Promise<AverageLectureDto> {
    const symbol = await this.getSymbol(querySymbol);
    if (!symbol) {
      throw new NotFoundException("Couldn't find the symbol");
    }
    const lectureCount =
      symbol.lectures.length < lectures ? symbol.lectures.length : lectures;
    if (lectureCount == 0) {
      throw new NotFoundException(
        'There are no lectures available for this Symbol',
      );
    }
    const lectureSum = symbol.lectures
      .slice(symbol.lectures.length - lectureCount, symbol.lectures.length)
      .reduce((sum, average) => sum + average);
    const average = lectureSum / lectureCount;
    return { average: average, numberOfLectures: lectureCount };
  }
}
