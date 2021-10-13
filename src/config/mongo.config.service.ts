import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class MongoConfigService {
  constructor(private readonly config: ConfigService) {}

  getConnectionConfig(): TypeOrmModuleOptions {
    return {
      type: 'mongodb',
      useUnifiedTopology: true,
      autoLoadEntities: true,
      database: 'crypto',
      authSource: 'admin',
      synchronize: true,
      host: this.config.get<string>('MONGODB_HOST'),
      port: this.config.get<number>('MONGODB_PORT'),
    };
  }
}
