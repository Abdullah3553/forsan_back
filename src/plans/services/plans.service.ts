import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Plan} from "../entities/plan.entity";
import {Repository} from "typeorm";
import {isNumber} from "util";
import {CreatePlanRequest} from "../requests/createPlan.request";

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

    createPlan (req: CreatePlanRequest) {
        // store plan
        const newPlan = new Plan()
        newPlan.name = req.name
        newPlan.months = req.months
        newPlan.price = req.price
        newPlan.description = req.description
        newPlan.isActivated = req.isActivated
        return this.plansRepo.save(newPlan)
    }

    async updatePlan (newInf: CreatePlanRequest, id: number) {
        //To get the current plan's data from the data base 
        //We search by id in the plans data base and then update the data
        const result = await this.checkPlanExist(id)
        result.name = newInf.name
        result.months = newInf.months
        result.price = newInf.price
        result.description = newInf.description
        result.isActivated = newInf.isActivated
        return this.plansRepo.save(result)
    }

    async deletePlan(id: number) {
        await this.checkPlanExist(id);
        await this.plansRepo.delete(id);
        return {message: 'Plan Deleted'};
    }

    async activatePLan(id: number) {
        // const plan = this.plansRepo.findOneOrFail(id)
        const plan = await this.checkPlanExist(id);
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
        const planStatus = await this.checkPlanExist(id)
        if(planStatus.isActivated){
            planStatus.isActivated = false
            this.plansRepo.save(planStatus)
            throw new BadRequestException({
                message: "Plan is de-activated successfully !"
            })
        }else{
            throw new BadRequestException({
                message: "Plan is already de-activated !"
            })
        }
    }


    async checkPlanExist(id: number) {
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
