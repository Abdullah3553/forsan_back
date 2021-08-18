import {IsNotEmpty} from "class-validator"

export class CreateNewOutComeRequest {
    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    description:string
}