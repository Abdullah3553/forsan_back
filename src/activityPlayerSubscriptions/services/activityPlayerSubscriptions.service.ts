import {Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {ActivityPlayerSubscription} from "../entities/activityPlayerSubscriptions.entity";
import {ActivitiesService} from "../../activities/services/activities.service";
import {ActivityPlayersService} from "../../activityPlayers/services/activityPlayers.service";
import {CreateNewActivityPlayerSubscriptionRequest} from "../requests/createNewActivityPlayerSubscription.request";


@Injectable()
export class ActivityPlayerSubscriptionsService {

    constructor(
        @InjectRepository(ActivityPlayerSubscription)
        private readonly activityPlayerSubscriptionRepo: Repository<ActivityPlayerSubscription>,
        private readonly activityService: ActivitiesService,
        private readonly activityPlayerService : ActivityPlayersService,
    ){}

    async getAll(limit, page) {
        limit = limit || 10
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1)* limit)

        const data: any = await this.activityPlayerSubscriptionRepo.findAndCount({
            take: limit,
            skip: offset,
        })
        return {
            items: data[0],
            count: data[1]
        }
        
        
        return await this.activityPlayerSubscriptionRepo.find()
       // return allSubscriptions.map(item=>{
      //      return{
      //          ...item,
      //          player_id:item.activityPlayer
     //       }
       // })
    }

    getAllActiviyPlayerSubscription(activityPlayerId:number){
        return this.activityPlayerSubscriptionRepo.find(
            {where: {activityPlayer:{id:activityPlayerId}}}
        )
    }

    async newSubscription(request:CreateNewActivityPlayerSubscriptionRequest){
        const newSub = new ActivityPlayerSubscription()
        newSub.activity = await this.activityService.doesActivityExists(request.activity_id)
        newSub.activityPlayer = await this.activityPlayerService.doesActivityPlayerExist(request.player_id)
        newSub.beginDate = request.beginDate
        newSub.endDate = request.endDate
        newSub.price = newSub.activity.price
        return this.activityPlayerSubscriptionRepo.save(newSub)
    }

    async updateSubDate(request, requestId:number){
        const sub = await this.doesSubscriptionExist(requestId)
        sub.beginDate = request.beginDate
        sub.endDate = request.endDate
        return this.activityPlayerSubscriptionRepo.save(sub)
    }

    async doesSubscriptionExist(id:number){
        const subscription = this.activityPlayerSubscriptionRepo.findOne({where:{id:id}})
        if(!subscription){
            throw new NotFoundException("Activity Player is not subscribe.")
        }
        return subscription
    }


}
