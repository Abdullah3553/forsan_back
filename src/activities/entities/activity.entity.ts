import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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

    // ech pl has many subs
    // @OneToMany(() => Subscription, sub => sub.player)
    // subscriptions: Subscription[]

}
