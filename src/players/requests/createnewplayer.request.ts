import { from } from "rxjs";
import {IsDate, IsDateString, isNotEmpty, IsNotEmpty} from "class-validator"

export class createNewPlayerRequest{
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    phoneNumber: string

    @IsDateString()
    beginDate: string 

    @IsDateString()
    endDate: string
    
    //photo

    @IsNotEmpty()
    height: number

    @IsNotEmpty()
    weight: number

    @IsNotEmpty()
    plan: string
}