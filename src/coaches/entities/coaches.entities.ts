import { Optional } from '@nestjs/common';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pt_Subscription } from 'src/pt/subscrpitions/entities/subscriptions.entity'

@Entity()
export class Coach {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  @Optional()
  ptIncome: number;

  @OneToMany(() => Pt_Subscription, sub => sub.player)
    subscriptions: Pt_Subscription[]
}
