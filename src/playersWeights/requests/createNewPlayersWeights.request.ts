import {IsDate, IsDecimal, IsNotEmpty,} from "class-validator"
import {Player} from "../../players/entities/player.entity";

export class createNewPlayersWeightsRequest {

    @IsNotEmpty()
    @IsDate()
    date:string

    @IsNotEmpty()
    @IsDecimal()
    weight:string

    @IsNotEmpty()
    player:Player

}