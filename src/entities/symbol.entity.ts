import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';

@Entity()
export class Symbol {
  @ObjectIdColumn()
  id: number;

  @Column()
  @IsString()
  @Index({ unique: true })
  symbol: string;

  @Column({ default: [] })
  lectures: number[] = [];
}
