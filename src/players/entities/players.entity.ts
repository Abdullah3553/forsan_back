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

    @Column({unique: true})
    phoneNumber: string

    @Column('double')
    weight: number

    @Column('double')
    height: number
}
