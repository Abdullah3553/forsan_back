import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PtSubscription } from 'src/pt/subscrpitions/entities/subscriptions.entity'

@Entity()
export class Coach {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column({
    nullable: true
  })
  ptIncome: number;

  @OneToMany(() => PtSubscription, sub => sub.player)
  subscriptions: PtSubscription[]

}
