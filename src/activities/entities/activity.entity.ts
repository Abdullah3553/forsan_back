import { ActivityPlayer } from "src/activity-players/entities/activity-player.entity";
import {Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity({
    name: "activities",
})

export class Activity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    coachName: string

    @Column({unique: true})
    coachPhoneNumber: string

    @Column('double')
    price: number

    @Column('text')
    description: string

    @OneToMany( () => ActivityPlayer, player => player.id, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        eager: true
    })
    @JoinColumn()
    players: ActivityPlayer[]
}
