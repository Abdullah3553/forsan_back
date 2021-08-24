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
        // this function for a better readiblity
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

    async getAllForPlayerDate(playerId:number, searchElement, searchOption:string, limit, page) {
        limit = limit || 10
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit)

        const subscroptions =  await this.subscriptionRepo.query(`SELECT *
                   FROM \`subscriptions\`
                   WHERE DATE(${searchOption}) = '${searchElement}'
                     AND \`playerId\` = ${playerId} LIMIT ${limit} OFFSET ${offset}`)
        return []
    }

    async getCount(searchElement, searchOption:string){
        const count= await this.subscriptionRepo.query(`SELECT count(id) as count
                   FROM \`subscriptions\`
                   WHERE DATE(${searchOption}) = '${searchElement}'`)
        return count[0].count
    }

}


/*
async getAllForPlayerDate(playerId:number, searchElement, searchOption:string) {
        let subscriptions
        if(searchOption === 'beginDate'){
             subscriptions = await this.subscriptionRepo.find({
                where: {
                    player: {
                        id: playerId
                    },
                    beginDate:searchElement
                },
            })
        }else if(searchOption ==='endDate'){
             subscriptions = await this.subscriptionRepo.find({
                where: {
                    player: {
                        id: playerId
                    },
                    endDate:searchElement
                },
            })
        }
        return subscriptions


    }

* */