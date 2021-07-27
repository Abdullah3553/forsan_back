import {Controller, Get, Param} from "@nestjs/common";
import {ServicesIncomeService} from "../service/servicesIncome.service";


@Controller("servicesIncome")
export class ServicesIncomeController {
    constructor(
        private readonly serviceIncomeService : ServicesIncomeService
    ) {}

    // get all services income for today date
    @Get('/')
    getToday(){
        return this.serviceIncomeService.getTodayServiceIncome()
    }

    //add item to a service
    @Get("/add/:id")
    buyService(@Param() parameters){
        return this.serviceIncomeService.buyService(parameters.id)
    }
}