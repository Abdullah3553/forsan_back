import {IsNotEmpty, IsNumber} from "class-validator"

export class createNewServiceRequest {
    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    @IsNumber()
    price:number
}