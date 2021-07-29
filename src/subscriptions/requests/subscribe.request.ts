import {IsDateString, IsNotEmpty} from "class-validator";

export class SubscribeRequest {
    @IsNotEmpty()
    player_id: number
    @IsNotEmpty()
    plan_id: number
    @IsNotEmpty()
    @IsDateString()
    beginDate: string
    @IsNotEmpty()
    @IsDateString()
    endDate: string
}