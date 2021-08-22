import {Body, Controller, Get, Param, Post, UseGuards} from "@nestjs/common";
import {ServicesIncomeService} from "../service/servicesIncome.service";
import {JwtAuthGuard} from "../../auth/guards/jwtAuthGuard";


@Controller("serviceIncome")
@UseGuards(JwtAuthGuard)
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
        return this.serviceIncomeService.buyService(body.id, body.todayDate, body.quantity)
    }
}
