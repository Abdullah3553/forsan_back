import { IsDate, IsNotEmpty, IsNumber } from "class-validator";


export class services_incomeRequest{
    @IsNumber()
    soldItems: number
}