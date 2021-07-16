import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "activity-player",
})

export class ActivityPlayer{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @Column({type: 'date'})
    beginDate: Date

    @Column({type: 'date'})
    endDate: Date

    @Column()
    activity: string
}