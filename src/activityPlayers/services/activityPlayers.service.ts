import {Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LogsService } from "src/logs /service/logs.service";
import { Repository } from "typeorm";
import { ActivityPlayer } from "../entities/activityPlayers.entity";
import { CreateNewActivityPlayerRequest } from "../requests/createNewActivityPlayer.request";


@Injectable()
export class ActivityPlayersService {

    constructor(
        @InjectRepository(ActivityPlayer)
        private readonly actPlayerRepo: Repository<ActivityPlayer>,
        private readonly logsService: LogsService
    ){}

    async getAll(){
        const data = await this.actPlayerRepo.find({
            relations: ['activitySubscriptions']
        })
        return data.map(item => {
            return {
                id: item.id,
                name: item.name,
                subscription: item.activitySubscriptions[item.activitySubscriptions.length-1]
            }
        })
    }

    async newActivityPlayer(newInput: CreateNewActivityPlayerRequest){
        const newPlayer = new ActivityPlayer()
        newPlayer.name = newInput.name
        const item = await this.actPlayerRepo.save(newPlayer)
        this.logsService.createNewLog(item.id, "new", "activity player")
    }

    async editActivityPlayer(newInput: CreateNewActivityPlayerRequest, reqId){
        const newActPlayer = await this.doesActivityPlayerExist(reqId)
        newActPlayer.name = newInput.name
        const item = await this.actPlayerRepo.save(newActPlayer)
        this.logsService.createNewLog(item.id, "edit", "activity player")
    }

    async deleteActivityPlayer(id: number){
        const activityPlayer = await this.doesActivityPlayerExist(id)
        await this.actPlayerRepo.remove(activityPlayer)
        this.logsService.createNewLog(id, "delete", "activity player")
        return{
            message: "Player Deleted!"
        }
    }

    async doesActivityPlayerExist(id:number){
        //get single player ...
        const activityPlayer = await this.actPlayerRepo.findOne({where:{id:id}})
        if(!activityPlayer){
            throw new NotFoundException("Player is Not Found")
        }
        return activityPlayer
    }
}