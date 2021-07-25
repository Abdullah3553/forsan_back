import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ActivityPlayer } from "../entities/activity-playersSubscription.entity";
import { addNewActPlayer } from "../requests/add-new-act-playerSubscription.request";


@Injectable()
export class activityPlayerServices{

    constructor(
        @InjectRepository(ActivityPlayer)
        private readonly actPlayerRepo: Repository<ActivityPlayer>
    ){}
    
    getAll(){
        return this.actPlayerRepo.find()
    }

    createNewActPlayer(newInput: addNewActPlayer){
        const newPlayer = new ActivityPlayer()
        newPlayer.name = newInput.name
        newPlayer.beginDate = newInput.beginDate
        newPlayer.endDate = newInput.endDate
        newPlayer.activity = newInput.activity
        return this.actPlayerRepo.save(newPlayer)
    }

    async EditActPlayer(newInput: addNewActPlayer, reqId){
        const newActPlayer = await this.actPlayerRepo.findOneOrFail({where: {id: reqId}})
        newActPlayer.name = newInput.name
        newActPlayer.beginDate = newInput.beginDate
        newActPlayer.endDate = newInput.endDate
        newActPlayer.activitys.push(newInput.activity)
        return this.actPlayerRepo.save(newActPlayer)
    }

    async deleteActPlayer(id: number){
        await this.actPlayerRepo.delete(id)
        return{
            message: "Player Deleted!"
        }
    }
}