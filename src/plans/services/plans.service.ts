import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Plan} from "../entities/plans.entity";
import {Repository} from "typeorm";
import {CreateNewPlanRequest} from "../requests/createNewPlan.request";
import {PartialSubscriptionsService} from "../../subscriptions/services/partialSubscriptions.service";
import { LogsService } from 'src/logs /service/logs.service';

@Injectable()
export class PlansService {

    constructor(
        @InjectRepository(Plan)
        private readonly plansRepo:  Repository<Plan>,
        private readonly partialSubscriptionService : PartialSubscriptionsService,
        private readonly logsService: LogsService
    ) {}

    getAll () {
        // return all plans
        // select * from plans
        return this.plansRepo.find();
    }

    getActivePlans(){
        return this.plansRepo.find({where:{
            isActivated : true
            }})
    }

    async newPlan (req: CreateNewPlanRequest) {
        // store plan
        const newPlan = new Plan()
        newPlan.name = req.name
        newPlan.months = req.months
        newPlan.price = req.price
        newPlan.description = req.description
        newPlan.isActivated = req.isActivated
        newPlan.invites = req.invites
        newPlan.freezeDays = req.freezeDays
        const item = await this.plansRepo.save(newPlan)
        await this.logsService.createNewLog(item.id, `added ${req.name} Plan`, "Plans")
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
        return this.plansRepo.save(result)
    }

    async deletePlan(id: number) {

        if(!await this.partialSubscriptionService.doesPlanHasActiveSubscriptions(id) && await this.doesPlanExist(id)){
            //if this condition is true , that means the plan is ok to be deleted
            const item = await this.doesPlanExist(id)
            await this.logsService.createNewLog(id, `Deleted ${item.name} Plan`, "Plans")
            await this.plansRepo.delete(id);
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

    async test(body){
        return {message:"test"}

    }

}
