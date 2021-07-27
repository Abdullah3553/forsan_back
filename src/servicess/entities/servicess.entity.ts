import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ServiceIncome} from "../../servicesIncome/entities/servicesIncome.entity";

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

    @OneToMany(()=> ServiceIncome, servieIncome => servieIncome.service)
    servicesIncome : ServiceIncome[]
}
