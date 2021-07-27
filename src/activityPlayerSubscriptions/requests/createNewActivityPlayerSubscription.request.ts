import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateNewActivityPlayerSubscriptionRequest {
    @IsNotEmpty()
    player_id: number

    @IsDateString()
    beginDate: Date

    @IsDateString()
    endDate: Date

    @IsNotEmpty()
    activity_id: number
}