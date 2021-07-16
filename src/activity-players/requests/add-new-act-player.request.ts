import { IsDateString, IsNotEmpty } from "class-validator";


export class addNewActPlayer{
    @IsNotEmpty()
    name: string

    @IsDateString()
    beginDate: Date

    @IsDateString()
    endDate: Date

    @IsNotEmpty()
    activity: string
}