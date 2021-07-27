import {Controller, Get, Param} from "@nestjs/common";
import {PlansIncomeService} from "../services/plansIncome.service";


@Controller("plansIncome")
export class PlansIncomeController {

    constructor(
        private readonly plansIncomeService: PlansIncomeService
    ){}

    @Get('/')
    getToday(){
        return this.plansIncomeService.getTodayPlansIncome()
    }

    @Get('/new/:id')
    planSubscribe(@Param() parametars){
        return this.plansIncomeService.subscribePlan(parametars.id)
    }
    
}