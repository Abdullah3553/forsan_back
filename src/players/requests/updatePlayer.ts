import {  IsNotEmpty,  IsOptional,  IsString} from "class-validator"
import { Column } from "typeorm"
export class UpdatePlayerRequest {
    
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    phoneNumber: string

    //@IsString()
    barCode: string

    @IsString()
    @IsOptional()
    trainingPlan?: string

    //@IsString()
    photo:string

    planId: string

    payedMoney: string

    

    @Column({
        type: 'date'
    })
    beginDate: string | Date

    @Column({
        type: 'date'
    })
    endDate: string | Date
}