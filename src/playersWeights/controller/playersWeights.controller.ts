import {Controller, Get, Post, Body, Param, Delete} from "@nestjs/common";
import { CreateNewPlayersWeightsRequest } from "../requests/createNewPlayersWeightsRequest";
import { PlayersWeightsServices } from "../services/playersWeights.service";


@Controller('playerWeight')
export class PlayersWeightsController {

    constructor(
        private readonly playersWeightsService : PlayersWeightsServices
    ){}

    @Get("/:id")
    getAll(@Param() parameters){
        return this.playersWeightsService.getAll(parameters.id)
    }

    @Post('/new/:id')
    createNewWeight(@Body() body:CreateNewPlayersWeightsRequest, @Param() parameters){
        return this.playersWeightsService.createNewWeight(body, parameters.id)
    }

    @Delete('delete/:id')
    deleteWeight(@Param() parameters){
        return this.playersWeightsService.deleteWeight(parameters.id)
    }


}

