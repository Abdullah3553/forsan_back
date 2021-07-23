import {Controller, Get, Param, Post} from "@nestjs/common";
import {services_incomeService} from "../service/service_income.service";


@Controller("services_income")
export class Services_incomeController{
    constructor(
        private readonly service_incomeService : services_incomeService
    ) {}

    // get all services income for today date
    @Get('/')
    getToday(){
        return this.service_incomeService.getTodayServiceIncome()
    }

    //add item to a service
    @Post("/add/:id")
    buyService(@Param() parametars){
        return this.service_incomeService.buyService(parametars.id)
    }
}