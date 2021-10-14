import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';
import { Entity, Column, ObjectIdColumn, Index, ObjectID } from 'typeorm';

@Entity()
export class CryptoSymbol {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @IsString()
  @Index({ unique: true })
  symbol: string;

  @Column({ default: [] })
  @Exclude()
  lectures: number[] = [];
}
