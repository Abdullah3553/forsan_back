import {IsNotEmpty, IsNumber} from "class-validator"

export class CreateNewServiceRequest {
    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    @IsNumber()
    price:number
}