import { IsNotEmpty, IsString } from "class-validator";


export class CreateNewActivityPlayerRequest {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsString()
    phoneNumber: string
}