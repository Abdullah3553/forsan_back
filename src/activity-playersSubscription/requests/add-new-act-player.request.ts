import { IsDateString, IsNotEmpty } from "class-validator";
import { Activity } from "src/activities/entities/activity.entity";


export class addNewActPlayer{
    @IsNotEmpty()
    name: string

    @IsDateString()
    beginDate: Date

    @IsDateString()
    endDate: Date

    @IsNotEmpty()
    activity: Activity
}