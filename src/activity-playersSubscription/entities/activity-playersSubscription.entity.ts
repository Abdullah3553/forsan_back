import { Activity } from "src/activities/entities/activity.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany,ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import {ActivityPlayer} from "../../activity-players/entities/activity-player.entity";

@Entity({
    name: "activity-playerSubscriptions",
})

export class ActivityPlayerSubscription {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'date'})
    beginDate: Date

    @Column({type: 'date'})
    endDate: Date

    @ManyToOne(()=>ActivityPlayer, activityPlayer=>activityPlayer.id, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        eager: true
    })
    @JoinColumn()
    activityPlayer: ActivityPlayer

    @ManyToOne( () => Activity, activity => activity.id, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        eager: true
    })
    @JoinColumn()
    activity: Activity
}