import { IsDate, IsNotEmpty, IsNumber } from "class-validator";


export class ServiceIncomeRequest {
    @IsNumber()
    soldItems: number
}