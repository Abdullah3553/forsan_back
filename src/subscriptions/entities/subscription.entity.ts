import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
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

    @ManyToOne( () => Player, player => player.id,{
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    @JoinColumn()
    player: Player

    @ManyToOne( () => Plan, plan => plan.id ,{
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn()
    plan: Plan
}

