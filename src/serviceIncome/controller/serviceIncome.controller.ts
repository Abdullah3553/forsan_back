import {Controller, Get, Param, Post} from "@nestjs/common";
import {ServiceIncomeService} from "../service/serviceIncome.service";


@Controller("serviceIncome")
export class ServiceIncomeController {
    constructor(
        private readonly serviceIncomeService : ServiceIncomeService
    ) {}

    // get all services income for today date
    @Get('/')
    getToday(){
        return this.serviceIncomeService.getTodayServiceIncome()
    }

    //add item to a service
    @Get("/add/:id")
    buyService(@Param() parametars){
        return this.serviceIncomeService.buyService(parametars.id)
    }
}