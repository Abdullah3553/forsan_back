import {IsNotEmpty} from "class-validator";

export class SubscribeRequest {
    @IsNotEmpty()
    player_id: number
    @IsNotEmpty()
    plan_id: number
    @IsNotEmpty()
    beginDate: Date
    @IsNotEmpty()
    endDate: Date
}