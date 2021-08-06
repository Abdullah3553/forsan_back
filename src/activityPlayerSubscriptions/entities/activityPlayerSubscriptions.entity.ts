import { Activity } from "src/activities/entities/activities.entity";
import { Column, Entity, JoinColumn,ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import {ActivityPlayer} from "../../activityPlayers/entities/activityPlayers.entity";

@Entity({
    name: "activityPlayerSubscriptions",
})

export class ActivityPlayerSubscription {
    @PrimaryGeneratedColumn()
    id: number

    @Column('double')
    price: number

    @Column({type: 'date'})
    beginDate: string

    @Column({type: 'date'})
    endDate: string

    @ManyToOne(() => ActivityPlayer, activityPlayer=>activityPlayer.id, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        eager:true
    })
    @JoinColumn()
    activityPlayer: ActivityPlayer

    @Column({type: 'date'})
    creationDate: string

    @ManyToOne( () => Activity, activity => activity.id, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        eager: true
    })
    @JoinColumn()
    activity: Activity
}