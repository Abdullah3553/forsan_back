import {Controller, Get, Post, Body, UseInterceptors, UploadedFile, Param, Delete} from "@nestjs/common";
import { createNewPlayersWeightsRequest } from "../requests/createNewPlayersWeights.request";
import { PlayersWeightsServices } from "../services/playersWeights.service";


@Controller('playerWeight')
export class PlayersWeightsController {

    constructor(
        private readonly playersWeightsService : PlayersWeightsServices
    ){}

    // TODO create an endpoint just for updating the photo
    
}

