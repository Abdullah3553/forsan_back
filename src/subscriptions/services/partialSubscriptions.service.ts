import {MoreThanOrEqual, Repository} from "typeorm";
import {Subscription} from "../entities/subscriptions.entity";
import * as moment from "moment/moment";
import {InjectRepository} from "@nestjs/typeorm";
import {BadRequestException, Injectable} from "@nestjs/common";

@Injectable()
export class PartialSubscriptionsService{

    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionRepo : Repository<Subscription>
    ) {}

    async getAllActiveSubscriptionsForPlan(planId:number){
        return await this.subscriptionRepo.find({
            where:{
                plan:{
                    id: planId
                },
                endDate:MoreThanOrEqual(moment().toDate())

            }
        })

    }

    async doesPlanHasActiveSubscriptions(planId:number){
        const subscriptions = await this.getAllActiveSubscriptionsForPlan(planId)
        if(subscriptions.length === 0){
            // plan has no active subscriptions
            return false
        }
        // plan has at least 1 active subscription
        throw new BadRequestException("You CANNOT delete a plan if it has at least 1 active player subscription")
    }

}