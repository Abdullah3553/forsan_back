import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Subscription} from "../entities/subscriptions.entity";
import {Repository} from "typeorm";
import {SubscribeRequest} from "../requests/subscribe.request";
import {PlayersServices} from "../../players/services/players.service";
import {PlansService} from "../../plans/services/plans.service";
import * as moment from "moment";

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionsRepo : Repository<Subscription>,
        private readonly playersService : PlayersServices,
        private readonly plansService: PlansService
    ) {}


    getAll(){
        return this.subscriptionsRepo.find()
    }
    getAllToday(todayDate:string){
        return this.subscriptionsRepo.find({
            where:{
                creationDate:todayDate
            }
        })
    }
    async getAllForPlayer(playerId:number){
        const subscriptions = await this.subscriptionsRepo.find({
            where:{
                player:{
                    id:playerId
                }
            }
        })
        if(subscriptions.length === 0){
            throw new BadRequestException("This player has no subscriptions")
        }
        return subscriptions
    }

    // create subscriptions or renew subscriptions
    // both will add new row in the table
    async subscribe(request: SubscribeRequest) {
        const player = await this.playersService.resetFreezeAndInvites(request.player_id)
        const plan = await this.plansService.doesPlanExist(request.plan_id);
        const subscription = new Subscription();
        subscription.player = player;
        subscription.plan = plan
        subscription.beginDate = request.beginDate
        subscription.endDate = request.endDate
        subscription.payedMoney = request.payedMoney
        subscription.creationDate = request.creationDate
        return await this.subscriptionsRepo.save(subscription);
    }

    async updateDate(request , requestId:number){
        const sub = await this.doesSubscriptionExist(requestId)
        sub.beginDate = request.beginDate
        sub.endDate = request.endDate
        return this.subscriptionsRepo.save(sub)
    }

    async doesSubscriptionExist(id:number){
        const sub = await this.subscriptionsRepo.findOne({where:{id:id}})
        if(!sub){
            throw new BadRequestException("Subscription doesn't exist")
        }
        return sub
    }

}
