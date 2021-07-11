import { link } from "fs";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "players",
})

export class player{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    phoneNumber: string

    @Column({type: 'date'})
    beginDate : string

    @Column({type: 'date'})
    endDate: string

    //photo

    @Column()
    plan : string

    @Column('double')
    weight: number

    @Column('double')
    height: number
}
