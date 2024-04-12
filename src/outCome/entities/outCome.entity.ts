import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("outcome")

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
