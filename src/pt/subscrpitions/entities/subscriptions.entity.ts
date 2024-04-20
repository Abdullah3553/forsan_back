import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {Plan} from "../../plan/entities/plans.entity";
import {Player} from "../../../players/entities/players.entity";
import {Coach} from "../../../coaches/entities/coaches.entities";

@Entity()
export class PtSubscription {
    @PrimaryGeneratedColumn()
    id: number

    @Column({default: 0})
    payed: number 

    @Column({
        type: 'date'
    })
    beginDate: string | Date

    @Column({
        type: 'date'
    })
    endDate: string | Date

    @Column('double')
    payedMoney:number

    @ManyToOne( () => Player, player => player.id,{
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        eager:true
    })
    @JoinColumn()
    player: Player

    @ManyToOne( () => Coach, coach => coach.id,{
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        eager:true
    })
    @JoinColumn()
    coach: Coach


    @ManyToOne( () => Plan, plan => plan.id ,{
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn()
    plan: Plan


    // timestamps
    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    })
    updatedAt: Date
}
