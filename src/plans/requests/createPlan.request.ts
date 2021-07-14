import {IsNotEmpty} from "class-validator";

export class CreatePlanRequest {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    months: number

    @IsNotEmpty()
    description: string

    isActivated?: boolean
}