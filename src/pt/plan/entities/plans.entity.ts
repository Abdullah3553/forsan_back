import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PtSubscription } from '../../../pt/subscrpitions/entities/subscriptions.entity';

@Entity('pt_plan')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sessions: string;

  @Column()
  price: string;

  @Column()
  duration: string;

  @OneToMany(() => PtSubscription, subscription => subscription.plan)
  subscriptions: PtSubscription[];
}
