import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoConfigService } from './config/mongo.config.service';
import { WatchlistModule } from './watchlist/watchlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: MongoConfigService) => {
        return configService.getConnectionConfig();
      },
      inject: [MongoConfigService],
      imports: [AppModule],
    }),
    ScheduleModule.forRoot(),
    WatchlistModule,
  ],
  providers: [MongoConfigService],
  exports: [MongoConfigService],
})
export class AppModule {}
