import {IsNotEmpty, IsNumber} from "class-validator";

export class CreateNewPlanRequest {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    months: number

    @IsNotEmpty()
    description: string

    isActivated?: boolean

    @IsNotEmpty()
    @IsNumber()
    numberOfExceptions:number
}