import {IsNotEmpty} from "class-validator";

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
}