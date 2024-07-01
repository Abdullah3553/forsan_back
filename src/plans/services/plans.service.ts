import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Plan} from "../entities/plans.entity";
import {Repository} from "typeorm";
import {CreateNewPlanRequest} from "../requests/createNewPlan.request";
import {PartialSubscriptionsService} from "../../subscriptions/services/partialSubscriptions.service";
import { LogsService } from '../../logsModule/service/logs.service';
import * as TelegramBot from 'node-telegram-bot-api';
import { UserContextService } from "../../dataConfig/userContext/user-context.service";
@Injectable()
export class PlansService {

    constructor(
        @InjectRepository(Plan)
        private readonly plansRepo:  Repository<Plan>,
        private readonly partialSubscriptionService : PartialSubscriptionsService,
        private readonly logsService: LogsService,
        private readonly userContextService: UserContextService
    ) {}

    getAll () {
        // return all plans
        // select * from plans
        return this.plansRepo.find();
    }

    getById(id: number){
        return this.plansRepo.findOne({
            where: {id: id}
        });
    }

    async getActivePlans(limit, page){
        limit = limit || 5;
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0
        const data = await this.plansRepo.findAndCount(
        {
            where:{
                isActivated : true
            },
            take: limit,
            skip: offset,
        })

        return {
            items: data[0],
            count: data[1]
        }
    }

    async newPlan (req: CreateNewPlanRequest) {
        // store plan
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        const newPlan = new Plan()
        newPlan.name = req.name
        newPlan.months = req.months
        newPlan.price = req.price
        newPlan.description = req.description
        newPlan.isActivated = true
        newPlan.invites = req.invites
        newPlan.freezeDays = req.freezeDays
        const item = await this.plansRepo.save(newPlan)
        await this.logsService.createNewLog(item.id, `added ${req.name} Plan`, "Plans")
        bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} added ${req.name} Plan`);
        return item
    }

    async updatePlan (newInf: CreateNewPlanRequest, id: number) {
        //To get the current plan's data from the data base
        //We search by id in the plans data base and then update the data
        const result = await this.doesPlanExist(id)
        await this.logsService.createNewLog(id, `Updated ${result.name} Plan`, "Plans")
        result.name = newInf.name
        result.months = newInf.months
        result.price = newInf.price
        result.description = newInf.description
        result.isActivated = newInf.isActivated
        result.invites = newInf.invites
        result.freezeDays =newInf.freezeDays
        const updatedPlan = this.plansRepo.save(result)
        this.editedData(result, updatedPlan);
        return updatedPlan;
    }

    editedData(oldData, newData) {
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        const extractData = (data) => ({
          name: data.name,
          description: data.description,
          months: data.months,
          invites: data.invites,
          freezeDays: data.freezeDays
        });
        const old = extractData(oldData);
        const newD = extractData(newData);
        const changedData = [];
        for (const key in old) {
            if (old.hasOwnProperty(key) && newD.hasOwnProperty(key)) {
                if (old[key] !== newD[key]) {
                    changedData.push({ field: key, newValue: newD[key], oldValue: old[key] });
                }
            }
        }
        changedData.forEach(item => {
          bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} edited plan: ${old.name} and has changed the ${item.field} from ${item.oldValue} to ${item.newValue}`);
        });
        
        return changedData;
    }

    async deletePlan(id: number) {
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        if(!await this.partialSubscriptionService.doesPlanHasActiveSubscriptions(id) && await this.doesPlanExist(id)){
            //if this condition is true , that means the plan is ok to be deleted
            const item = await this.doesPlanExist(id)
            await this.logsService.createNewLog(id, `Deleted ${item.name} Plan`, "Plans")
            await this.plansRepo.delete(id);
            bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} deleted ${item.name} Plan`);
    
            return {message: 'Plan Deleted'};
        }
        // if the condition is not true, each function call will throw an exception if it's false
    }

    async activatePlan(id: number) {
        // const plan = this.plansRepo.findOneOrFail(id)
        const plan = await this.doesPlanExist(id);
        if (plan.isActivated) {
            throw new BadRequestException({
                message: "Plan is already activated"
            })
        }
        await this.logsService.createNewLog(id, `Activated ${plan.name} Plan`, "Plans")
        plan.isActivated = true
        return this.plansRepo.save(plan);
    }

    async getActivePlansCount(){
        return await this.plansRepo.count({
            where:{
                isActivated: true
            }
        })
    }

    //we create an object to get the current plan status
    //if the plan is already De-Activated we throw an exception
    //if not we De-Activate it!
    async deActivatePlan (id: number) {
        const planStatus = await this.doesPlanExist(id)
        if(planStatus.isActivated){
            planStatus.isActivated = false
            await this.logsService.createNewLog(id, `De-Activated ${planStatus.name} Plan`, "Plans")
            await this.plansRepo.save(planStatus)
            return {message: "Plan is de-activated successfully !"}
        }else{
            throw new BadRequestException({
                message: "Plan is already de-activated !"
            })
        }
    }

    async doesPlanExist(id: number) {
        const plan = await this.plansRepo.findOne({
            where: {
                id: id,
            }
        })
        if (!plan) {
            throw new NotFoundException({
                message: 'Plan not found'
            })
        }
        return plan
    }

}
