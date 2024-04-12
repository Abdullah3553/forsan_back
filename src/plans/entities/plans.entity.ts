import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Subscription} from "../../subscriptions/entities/subscriptions.entity";



@Entity()
export class Plan {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    price: number

    @Column()
    months: number

    @Column('smallint')
    invites: number

    @Column('smallint')
    freezeDays: number

    @Column({
        default: false,
        type:"smallint",
        width:1
    })
    isActivated: boolean

    // each plan has many sub
    @OneToMany(() => Subscription, sub => sub.plan )
    subscriptions: Subscription[]

}