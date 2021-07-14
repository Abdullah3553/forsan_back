import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Plan} from "../../plans/entities/plan.entity";
import {Player} from "../../players/entities/player.entity";

@Entity({
    name: 'subscriptions'
})

export class Subscription {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'date'
    })
    beginDate: Date

    @Column({
        type: 'date'
    })
    endDate: Date

    @Column()
    price: number

    @OneToOne( () => Player, player => player.id)
    @JoinColumn()
    player: Player

    @OneToOne( () => Plan, plan => plan.id ,{
        onDelete: "SET NULL"
    })
    @JoinColumn()
    plan: Plan
}

