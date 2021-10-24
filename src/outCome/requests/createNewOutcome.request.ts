import {IsNotEmpty, IsNumber} from "class-validator"

export class CreateNewOutComeRequest {
    @IsNotEmpty()
    @IsNumber()
    price: number

    @IsNotEmpty()
    description:string

    @IsNotEmpty()
    dayDate:Date|string
}