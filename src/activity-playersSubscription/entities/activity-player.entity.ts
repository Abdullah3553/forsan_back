import { Activity } from "src/activities/entities/activity.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "activity-player",
})

export class ActivityPlayer{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @Column({type: 'date'})
    beginDate: Date

    @Column({type: 'date'})
    endDate: Date

    @OneToMany( () => Activity, activity => activity.id, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        eager: true
    })
    @JoinColumn()
    activitys: Activity[]
}