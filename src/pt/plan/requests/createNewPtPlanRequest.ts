import {IsNotEmpty} from "class-validator";

export class CreateNewPtPlanRequest {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    sessions: string;

    @IsNotEmpty()
    price: string;

    @IsNotEmpty()
    duration: string;
}