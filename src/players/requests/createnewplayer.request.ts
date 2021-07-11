import { from } from "rxjs";
import {IsDate, IsDateString, isNotEmpty, IsNotEmpty} from "class-validator"

export class createNewPlayerRequest{
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    phoneNumber: string

    @IsDate()
    beginDate: string 

    @IsDate()
    endDate: string
    
    //photo

    @IsNotEmpty()
    height: number

    @IsNotEmpty()
    weight: number

    @IsNotEmpty()
    plan: string
}