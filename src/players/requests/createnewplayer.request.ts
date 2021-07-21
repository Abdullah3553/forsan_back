import { from } from "rxjs";
import {IsDate, IsDateString, IsDecimal, isNotEmpty, IsNotEmpty, IsNumber, IsString} from "class-validator"

export class createNewPlayerRequest{
    
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    phoneNumber: string

    @IsNotEmpty()
    @IsDecimal()
    height: number

    @IsNotEmpty()
    @IsDecimal()
    weight: number

    // @IsNotEmpty()
    // plan: number
}