import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Plan} from "../entities/plans.entity";
import {Repository} from "typeorm";
import {CreateNewPlanRequest} from "../requests/createNewPlan.request";
import * as moment from "moment/moment";

@Injectable()
export class PlansService {

    constructor(
        @InjectRepository(Plan)
        private readonly plansRepo:  Repository<Plan>
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

    newPlan (req: CreateNewPlanRequest) {
        // store plan
        const newPlan = new Plan()
        newPlan.name = req.name
        newPlan.months = req.months
        newPlan.price = req.price
        newPlan.description = req.description
        newPlan.isActivated = req.isActivated
        newPlan.invites = req.invites
        newPlan.freezeDays = req.freezeDays
        return this.plansRepo.save(newPlan)
    }

    async updatePlan (newInf: CreateNewPlanRequest, id: number) {
        //To get the current plan's data from the data base 
        //We search by id in the plans data base and then update the data
        const result = await this.doesPlanExist(id)
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
        await this.doesPlanExist(id);
        await this.isPlanDeletable(id)
        await this.plansRepo.delete(id);
        return {message: 'Plan Deleted'};
    }

    async activatePlan(id: number) {
        // const plan = this.plansRepo.findOneOrFail(id)
        const plan = await this.doesPlanExist(id);
        if (plan.isActivated) {
            throw new BadRequestException({
                message: "Plan is already activated"
            })
        }
        plan.isActivated = true
        return this.plansRepo.save(plan);
    }
    
    //we create an object to get the current plan status
    //if the plan is already De-Acticated we throw an exception
    //if not we De-Activate it! 
    async deActivatePlan (id: number) {
        const planStatus = await this.doesPlanExist(id)
        if(planStatus.isActivated){
            planStatus.isActivated = false
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

    async isPlanDeletable(planId:number){
        // find all subscription of a plan
        const plan = await this.plansRepo.findOne({
            relations:['subscriptions'],
            where:{
                id:planId
            }
        })
        for(let i=0;i<plan.subscriptions.length;i++){
            if(moment(plan.subscriptions[i].endDate).isAfter(moment())){
                // this is an active subscription
                throw new BadRequestException("You CANNOT delete a plan if it has at least 1 active subscription")
            }
        }
        return true
    }

    async test(body){
        return { message:"This is a test message "}
    }

}
