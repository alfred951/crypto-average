import { IsString } from 'class-validator';
import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';

@Entity()
export class CryptoSymbol {
  @ObjectIdColumn()
  id: number;

  @Column()
  @IsString()
  @Index({ unique: true })
  symbol: string;

  @Column({ default: [] })
  lectures: number[] = [];
}
