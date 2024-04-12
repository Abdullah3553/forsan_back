import {IsNotEmpty, IsString} from "class-validator";

export class CreateCoachRequest {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string;
}