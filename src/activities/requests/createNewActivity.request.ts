import {IsNotEmpty} from "class-validator"

export class CreateNewActivityRequest {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    coachName: string

    @IsNotEmpty()
    coachPhoneNumber: string

    price: number

    @IsNotEmpty()
    description:string
}