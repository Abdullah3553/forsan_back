import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Service} from "../../servicess/entities/servicess.entity";


@Entity({
   name : "servicesIncome" 
})

export class ServiceIncome{
    @PrimaryGeneratedColumn()
    id: number

    @Column({default: 0})
    soldItems: number

    @Column({type: 'date'})
    dayDate: string

    @Column()
    payedMoeny:number
    
    @ManyToOne(() => Service, service => service.id,{
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        eager: true
    })
    @JoinColumn()
    service:Service
}