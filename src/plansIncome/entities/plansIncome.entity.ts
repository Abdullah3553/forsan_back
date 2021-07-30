import { Plan } from "src/plans/entities/plans.entity";
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from "typeorm";


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
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        eager: true
    })
    @JoinColumn()
    plan: Plan
}