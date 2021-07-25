import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { Plan } from "src/plans/entities/plan.entity";
import { PlansService } from "src/plans/services/plans.service";
import { Repository } from "typeorm";
import { PlanIncome } from "../entities/planIncome.entity";


@Injectable()
export class PlanIncomeService {

    constructor(
        @InjectRepository(PlanIncome)
        private readonly planIncomeRepo: Repository<PlanIncome>,
        private readonly plansService: PlansService
    ){}
    getTodayPlansIncome(){
        const todayDate = moment().format("yyyy-MM-DD")
        return this.planIncomeRepo.find({where:{
            dayDate:todayDate
            }})
    }

    async subscripePlan(reqId: number){
        const planIncome = await this.dosePlanIncomeExist(reqId)
        planIncome.numberOfPlayers++
        return this.planIncomeRepo.save(planIncome)
    }

    async dosePlanIncomeExist(id: number){
        const plan = await this.plansService.checkPlanExist(id)
        let planIncome = await this.planIncomeRepo.findOne({
            where:{
                plan:plan,
                dayDate:moment().format("yyyy-MM-DD")
            }
        })
        if(!planIncome){
            // plan is not on  the tabke for todat's date
            // so we need to add it
            planIncome = await this.addNewPlanIncome(plan)
        }
        return planIncome
    }
    addNewPlanIncome(plan: Plan){
        const planIncome = new PlanIncome()
        planIncome.plan = plan
        planIncome.dayDate = moment().format("yyyy-MM-DD")
        return this.planIncomeRepo.save(planIncome)
    }
}