import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity({
    name: "outcome",
})

export class OutCome {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    price: number

    @Column()
    description: string

    @Column({
        type: 'timestamp'
    })
    creationDate:Date|string

}
