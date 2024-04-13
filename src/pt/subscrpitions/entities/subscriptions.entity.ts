import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Plan} from "../../plan/entities/plans.entity";
import {Player} from "../../../players/entities/players.entity";
import {Coach} from "../../../coaches/entities/coaches.entities";

@Entity("pt_subscription")

export class Pt_Subscription {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'timestamp'
    })
    beginDate: string | Date

    @Column({
        type: 'timestamp'
    })
    endDate: string | Date

    @Column('double')
    payedMoney:number

    @Column('date')
    creationDate:string

    //Relations :-

    @ManyToOne( () => Player, player => player.id,{
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        eager:false
    })
    @JoinColumn()
    player: Player

    @ManyToOne( () => Coach, coach => coach.id,{
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        eager:false
    })
    @JoinColumn()
    coach: Coach

    @ManyToOne( () => Plan, plan => plan.id ,{
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn()
    plan: Plan
}

