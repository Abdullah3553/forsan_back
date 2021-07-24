import { Plan } from "src/plans/entities/plan.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({
    name: "plansIncome"
})

export class PlanIncome{

    @PrimaryGeneratedColumn()
    id: number


    @Column({type: 'date'})
    dayDate: string

    @Column()
    numberOfPlayers: number

    @OneToOne ( () => Plan, plan => plan.id, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        eager: true
    })
    @JoinColumn()
    plan: Plan
}