import { Entity, Column, ObjectIdColumn, Index, ObjectID } from 'typeorm';

@Entity()
export class Symbol {
  @ObjectIdColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  symbol: string;
}
