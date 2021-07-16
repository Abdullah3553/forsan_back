import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({
    name: "services",
})

export class Service {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column('double')
    price: number

}
