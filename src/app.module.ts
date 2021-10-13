import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoConfigService } from './config/mongo.config.service';

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
  ],
  controllers: [AppController],
  providers: [AppService, MongoConfigService],
  exports: [MongoConfigService],
})
export class AppModule {}
