import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PtSubscription } from 'src/pt/subscrpitions/entities/subscriptions.entity';

@Entity('pt_plan')
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

  @OneToMany(() => PtSubscription, subscription => subscription.plan)
  subscriptions: PtSubscription[];
}
