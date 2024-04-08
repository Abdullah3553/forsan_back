import {IsNotEmpty, IsNumber} from "class-validator";

export class CreateNewPtPlanRequest {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    sessions: number;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    duration: number;
}