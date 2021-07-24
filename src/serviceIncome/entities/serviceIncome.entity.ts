import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
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
    
    
    @OneToOne(() => Service, service => service.id,{
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        eager: true
    })
    @JoinColumn()
    service:Service
}