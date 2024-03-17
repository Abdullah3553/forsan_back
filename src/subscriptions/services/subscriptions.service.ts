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
    async getAllToday(todayDate:string){
        const subscriptions = await this.subscriptionsRepo.find({
            where:{
                creationDate:todayDate
            }
        })
        const plans = await this.plansService.getAll()
        const indexedPlans = [], res=[]
        for(let i=0;i<plans.length;i++){
            if(plans[i].isActivated){
                indexedPlans[plans[i].id] = {
                    numberOfSubscriptions:0,
                    payedMoney:0,
                    plan:plans[i]
                }
            }
        }

        for(let i=0;i<subscriptions.length;i++){
            indexedPlans[subscriptions[i].plan.id].numberOfSubscriptions++;
            indexedPlans[subscriptions[i].plan.id].payedMoney+=subscriptions[i].payedMoney;
        }
        for(let i=0;i<plans.length;i++){
            if(plans[i].isActivated)
                res.push(indexedPlans[plans[i].id])
        }
        return res

    }
    async getAllForPlayer(playerId:number, limit: number, page: number){
        limit = limit || 3
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0
        const subscriptions = await this.subscriptionsRepo.findAndCount({
            where:{
                player:{
                    id:playerId
                }
            },
            order: {
                id: "DESC",
            },
            take:limit,
            skip:offset
        })

        if(subscriptions[0].length === 0){
            throw new BadRequestException("This player has no subscriptions")
        }
        subscriptions[0] = subscriptions[0].map(sub=>{
            return{
                ...sub,
                beginDate: moment(sub.beginDate).format('yyyy-MM-DD'),
                endDate: moment(sub.endDate).format('yyyy-MM-DD'),
            }
        })
        return {
            items: subscriptions[0],
            count: subscriptions[1]
        }
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
        sub.payedMoney = request.payedMoney
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
