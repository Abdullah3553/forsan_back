import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { Activity } from "../../activities/entities/activities.entity";
import { ActivitiesService } from "../../activities/services/activities.service";
import { ActivityPlayerSubscription } from "../../activityPlayerSubscriptions/entities/activityPlayerSubscriptions.entity";
import { ActivityPlayerSubscriptionsService } from "../../activityPlayerSubscriptions/services/activityPlayerSubscriptions.service";
import { Repository } from "typeorm";
import { ActivityIncome } from "../entities/activitiesIncome.entity";

@Injectable()
export class ActivitiesIncomeService{
    constructor(
        @InjectRepository(ActivityIncome)
        private readonly activityIncomeRepo: Repository<ActivityIncome>,
        private readonly activityPlayerSubscriptionsServices: ActivityPlayerSubscriptionsService
    ){}

    getTodayActivityIncome(){
        const currentDate = moment().format("YYYY-MM-DD")
        return this.activityIncomeRepo.find({where: 
            {dayDate: currentDate} 
        })
    }

    async subscribeActivity(reqId: number){
        const activityIncome = await this.doseActivityIncomeExist(reqId)
        activityIncome.numberOfPlayers++
        return this.activityIncomeRepo.save(activityIncome)
    }

    async doseActivityIncomeExist(id: number){
        const activitySubscription = await this.activityPlayerSubscriptionsServices.doesSubscriptionExist(id)
        let activityIncome = await this.activityIncomeRepo.findOne({
            where:{
                activitySubscription:activitySubscription,
                dayDate:moment().format("yyyy-MM-DD")
            }
        })
        if(!activityIncome){
            activityIncome = await this.newActivityIncome(activitySubscription)
        }
        return activityIncome
    }
    newActivityIncome(activity: ActivityPlayerSubscription){
        const activityIncome = new ActivityIncome()
        activityIncome.numberOfPlayers = 0
        activityIncome.activitySubscription = activity
        activityIncome.dayDate = moment().format("yyyy-MM-DD")
        return this.activityIncomeRepo.save(activityIncome)
    }
}