import {IsDate, IsDecimal, IsNotEmpty,} from "class-validator"

export class CreateNewPlayersWeightsRequest {

    @IsNotEmpty()
    @IsDate()
    date:Date

    @IsNotEmpty()
    @IsDecimal()
    weight:string

    @IsNotEmpty()
    player_id: number

}