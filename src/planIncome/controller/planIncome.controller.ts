import {Controller, Get, Param} from "@nestjs/common";
import {planIncomeService} from "../services/planIncome.service";


@Controller("planIncome")
export class planIncomeController{

    constructor(
        private readonly planIncomeService: planIncomeService
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