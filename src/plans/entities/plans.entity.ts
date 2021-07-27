import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Subscription} from "../../subscriptions/entities/subscriptions.entity";
import { PlanIncome } from "src/plansIncome/entities/plansIncome.entity";



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