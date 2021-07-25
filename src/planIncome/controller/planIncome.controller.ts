import {Controller, Get, Param} from "@nestjs/common";
import {PlanIncomeService} from "../services/plan-income.service";


@Controller("planIncome")
export class planIncomeController{

    constructor(
        private readonly planIncomeService: PlanIncomeService
    ){}

    @Get('/')
    getToday(){
        return this.planIncomeService.getTodayPlansIncome()
    }

    @Get('/new/:id')
    planSubscribe(@Param() parametars){
        return this.planIncomeService.subscripePlan(parametars.id)
    }
    
}