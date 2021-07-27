import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ActivityPlayer } from "../entities/activity-player.entity";
import { addNewActPlayer } from "../requests/add-new-act-player.request";


@Injectable()
export class activityPlayerServices{

    constructor(
        @InjectRepository(ActivityPlayer)
        private readonly actPlayerRepo: Repository<ActivityPlayer>
    ){}
    

    getSinglePlayer (player_id: number) {
        return this.actPlayerRepo.findOne(player_id);
    }

    async getAll(){
        const data = await this.actPlayerRepo.find({
            relations: ['activitySubscriptions']
        })
        return data.map(item => {
            return {
                id: item.id,
                name: item.name,
                beginDate: item.activitySubscriptions[0]?.beginDate,
                endDate: item.activitySubscriptions[0]?.endDate,
                activity: item.activitySubscriptions[0]?.activity.name,
                activity_id: item.activitySubscriptions[0]?.activity.id

            }
        })
    }

    createNewActPlayer(newInput: addNewActPlayer){
        const newPlayer = new ActivityPlayer()
        newPlayer.name = newInput.name
        return this.actPlayerRepo.save(newPlayer)
    }

    async EditActPlayer(newInput: addNewActPlayer, reqId){
        const newActPlayer = await this.actPlayerRepo.findOneOrFail({where: {id: reqId}})
        newActPlayer.name = newInput.name
        return this.actPlayerRepo.save(newActPlayer)
    }

    async deleteActPlayer(id: number){
        await this.actPlayerRepo.delete(id)
        return{
            message: "Player Deleted!"
        }
    }
}