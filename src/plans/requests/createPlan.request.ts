import {IsNotEmpty} from "class-validator";

export class CreatePlanRequest {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    description: string

    isActivated?: boolean
}