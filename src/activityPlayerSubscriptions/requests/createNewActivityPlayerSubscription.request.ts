import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateNewActivityPlayerSubscriptionRequest {
    @IsNotEmpty()
    player_id: number

    @IsNotEmpty()
    @IsDateString()
    beginDate: string

    @IsNotEmpty()
    @IsDateString()
    endDate: string

    @IsNotEmpty()
    activity_id: number

    @IsNotEmpty()
    @IsNumber()
    price: number
}