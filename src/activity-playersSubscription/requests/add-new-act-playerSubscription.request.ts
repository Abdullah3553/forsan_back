import { IsDateString, IsNotEmpty } from "class-validator";
import { Activity } from "src/activities/entities/activity.entity";
import {ActivityPlayer} from "../../activity-players/entities/activity-player.entity";


export class addNewActPlayer{
    @IsNotEmpty()
    activityPlayer : ActivityPlayer

    @IsDateString()
    beginDate: Date

    @IsDateString()
    endDate: Date

    @IsNotEmpty()
    activity: Activity
}