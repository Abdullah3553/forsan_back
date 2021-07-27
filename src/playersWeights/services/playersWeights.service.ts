import {Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {PlayerWeight} from "../entities/playersWeights.entity";
import {CreateNewPlayersWeightsRequest} from "../requests/createNewPlayersWeightsRequest";
import {PlayersServices} from "../../players/services/players.service";

@Injectable()
export class PlayersWeightsServices {

    // Creating player's object 
    constructor(
        @InjectRepository(PlayerWeight)
        private readonly playersWeightsRepo:  Repository<PlayerWeight>,
        private readonly playersService: PlayersServices
    ) {}

    getAll(playerId:number){
       return this.playersWeightsRepo.find({where:{id:playerId}})
    }

    async createNewWeight(request:CreateNewPlayersWeightsRequest, requestId:number){
        const weight = new PlayerWeight()
        weight.date = request.date
        weight.weight = request.weight
        weight.player = await this.playersService.doesPlayerExist(requestId)
        return this.playersWeightsRepo.save(weight)
    }

    async deleteWeight(requestId){
        return await this.playersWeightsRepo.remove(await this.doesWeightExist(requestId))
    }

    async doesWeightExist(id){
        const weight = this.playersWeightsRepo.findOne({where:{id:id}})
        if(!weight){
            throw new NotFoundException("Weight doesn't Exist")
        }
        return weight
    }





}