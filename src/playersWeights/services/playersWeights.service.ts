import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { createNewPlayersWeightsRequest } from "../requests/createNewPlayersWeights.request";
import {PlayerWeights} from "../entities/playersWeights.entity";

@Injectable()
export class PlayersWeightsServices {

    // Creating player's object 
    constructor(
        @InjectRepository(PlayerWeights)
        private readonly playersWeightsRepo:  Repository<PlayerWeights>
    ) {}

}