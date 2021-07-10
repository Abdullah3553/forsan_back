import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({
    name: 'plans',
})
export class Plan {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    price: number

    @Column({
        default: false
    })
    isActivated: boolean

}