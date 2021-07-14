import { from } from "rxjs";
import {IsDate, IsDateString, isNotEmpty, IsNotEmpty} from "class-validator"

export class createNewPlayerRequest{
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    phoneNumber: string

    @IsNotEmpty()
    height: number

    @IsNotEmpty()
    weight: number

    @IsNotEmpty()
    plan: number
}