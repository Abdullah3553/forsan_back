import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity("pt_plans")
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sessions: number;

  @Column()
  price: number;

  @Column()
  duration: number;

}
