import {IsNotEmpty} from "class-validator"

export class createNewActivityRequest {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    coachName: string

    @IsNotEmpty()
    coachPhoneNumber: string

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    description:string
}