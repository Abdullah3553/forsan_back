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

    async getPlayerWeights(playerId:number, limit, page){
        limit = limit || 10
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit)
        const weights = await this.playersWeightsRepo.findAndCount({
            where:{
                player:{
                    id:playerId
                }
            },
            take:limit,
            skip:offset
        })
        return{
            items: weights[0],
            count: weights[1]
        }
    }

    async createNewWeight(request:CreateNewPlayersWeightsRequest){
        const weight = new PlayerWeight()
        weight.date = request.date
        weight.weight = request.weight
        weight.player = await this.playersService.doesPlayerExist(request.player_id)
        return await this.playersWeightsRepo.save(weight)
    }

    async deleteWeight(requestId:number){
        await this.doesWeightExist(requestId)
        return await this.playersWeightsRepo.delete(requestId)
    }

    async editWeight(request:CreateNewPlayersWeightsRequest, requestedId){
        const weight = await this.doesWeightExist(requestedId)
        weight.weight = request.weight
        weight.date = request.date
        return this.playersWeightsRepo.save(weight)
    }

    async doesWeightExist(id){
        const weight = await this.playersWeightsRepo.findOne({where:{id:id}})
        if(!weight){
            throw new NotFoundException("Weight doesn't Exist")
        }
        return weight
    }





}