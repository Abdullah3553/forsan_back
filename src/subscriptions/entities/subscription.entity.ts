import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
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

    @ManyToOne( () => Player, player => player.id)
    @JoinColumn()
    player: Player

    @ManyToOne( () => Plan, plan => plan.id ,{
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn()
    plan: Plan
}

