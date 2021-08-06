import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateNewActivityPlayerSubscriptionRequest {
    @IsNotEmpty()
    player_id: number

    @IsDateString()
    beginDate: string

    @IsDateString()
    endDate: string

    @IsNotEmpty()
    activity_id: number

    @IsNotEmpty()
    @IsNumber()
    price: number
}