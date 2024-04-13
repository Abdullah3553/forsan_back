import {IsDateString, IsNotEmpty, IsNumber} from "class-validator";

export class CreateSubscriptionRequest {
    @IsNotEmpty()
    player_id: number
    @IsNotEmpty()
    plan_id: number
    @IsNotEmpty()
    coach_id: number
    @IsNotEmpty()
    @IsDateString()
    beginDate: string
    @IsNotEmpty()
    @IsDateString()
    endDate: string
    @IsNotEmpty()
    @IsNumber()
    payedMoney:number
    @IsNotEmpty()
    @IsDateString()
    creationDate:string
}