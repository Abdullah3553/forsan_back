import {Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Subscription} from "../../subscriptions/entities/subscription.entity";
import {subscribeOn} from "rxjs";
import { PlanIncome } from "src/planIncome/entities/planIncome.entity";



@Entity({
    name: 'plans',
})
export class Plan {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    price: number

    @Column()
    months: number


    @Column({
        default: false
    })
    isActivated: boolean

    // each plan has many sub
    @OneToMany(() => Subscription, sub => sub.plan )
    subscriptions: Subscription[]

    @OneToMany( () => PlanIncome, planIncome => planIncome.plan)
    plansIncome: PlanIncome[]
}