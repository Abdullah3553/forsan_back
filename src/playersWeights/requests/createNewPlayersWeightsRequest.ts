import { IsDateString, IsDecimal, IsNotEmpty,} from "class-validator"

export class CreateNewPlayersWeightsRequest {

    @IsNotEmpty()
    @IsDateString()
    date:Date

    @IsNotEmpty()
    @IsDecimal()
    weight:string

    @IsNotEmpty()
    player_id: number

}