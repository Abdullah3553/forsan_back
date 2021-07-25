import { Plan } from "src/plans/entities/plan.entity";
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import {ManyToOne} from "typeorm/browser";


@Entity({
    name: "plansIncome"
})

export class PlanIncome{

    @PrimaryGeneratedColumn()
    id: number


    @Column({type: 'date'})
    dayDate: string

    @Column({default:0})
    numberOfPlayers: number

    @ManyToOne ( () => Plan, plan => plan.id, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        eager: true
    })
    @JoinColumn()
    plan: Plan
}