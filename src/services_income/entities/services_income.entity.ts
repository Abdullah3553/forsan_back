import { type } from "os";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({
   name : "servicesIncome" 
})

export class ServiceIncome{
    @PrimaryGeneratedColumn()
    id: number

    @Column({default: 0})
    soldItems: number

    @Column({type: 'date'})
    dayDate: Date
    
    
    //serviceId: number
}