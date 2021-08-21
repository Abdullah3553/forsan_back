import {Controller, Get, Post, Body, Param, Delete, Query} from "@nestjs/common";
import { CreateNewPlayersWeightsRequest } from "../requests/createNewPlayersWeightsRequest";
import { PlayersWeightsServices } from "../services/playersWeights.service";

@Controller('playerWeight')
export class PlayersWeightsController {

    constructor(
        private readonly playersWeightsService : PlayersWeightsServices
    ){}

    @Get("/allWeights/:id")
    getAll(@Param() parameters, @Query() {limit, page}){
        return this.playersWeightsService.getPlayerWeights(parameters.id, limit, page)
    }

    @Post('/new')
    createNewWeight(@Body() body:CreateNewPlayersWeightsRequest){
        return this.playersWeightsService.createNewWeight(body)
    }

    @Delete('delete/:id')
    deleteWeight(@Param() parameters){
        return this.playersWeightsService.deleteWeight(parameters.id)
    }

    @Post('edit/:id')
    editWeight(@Body() body:CreateNewPlayersWeightsRequest, @Param() parameters){
        return this.playersWeightsService.editWeight(body, parameters.id)
    }

}

