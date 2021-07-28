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

