import { Controller, Get, Param } from "@nestjs/common";
import { ActivitiesIncomeService } from "../services/activitiesIncome.services";


@Controller("activityIncome")
export class ActivitiesIncomeController{

    constructor(
        private readonly activitiesIncomeService: ActivitiesIncomeService
    ){}
    @Get('/')
    getToday(){
        return this.activitiesIncomeService.getTodayActivityIncome()
    }

    @Get('/new/:id')
    activitySubscribe(@Param() parametars){
        return this.activitiesIncomeService.subscribeActivity(parametars.id)
    }
}