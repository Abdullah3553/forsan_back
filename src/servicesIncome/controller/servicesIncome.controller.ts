import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {ServicesIncomeService} from "../service/servicesIncome.service";


@Controller("serviceIncome")
export class ServicesIncomeController {
    constructor(
        private readonly serviceIncomeService : ServicesIncomeService
    ) {}

    // get all services income for today date
    @Post('/today')
    getToday(@Body('todayDate')todayDate: string){
        return this.serviceIncomeService.getTodayServiceIncome(todayDate)
    }

    //add item to a service
    @Post("/add")
    buyService(@Body()body){
        return this.serviceIncomeService.buyService(body.id, body.todayDate)
    }
}