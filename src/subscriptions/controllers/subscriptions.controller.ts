import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {SubscriptionsService} from "../services/subscriptions.service";
import {SubscribeRequest} from "../requests/subscribe.request";

@Controller('subscription')
export class SubscriptionsController {
    constructor(
        private readonly subscriptionsService: SubscriptionsService,
    ) {}

    @Get('/')
    getAll(){
        return this.subscriptionsService.getAll()
    }

    @Post('/today')
    getAllToday(@Body()body){
        return this.subscriptionsService.getAllToday(body.todayDate)
    }

    @Get("active")
    getAllActive(){
        return this.subscriptionsService.getAllActiveCount();
    }

    @Get("TotalIncome")
    getTodayIncome(){
        return this.subscriptionsService.getTodayIncome();
    }

    @Get("/thisMonth")
    getAllForCurrentMonth(){
        return this.subscriptionsService.getAllForCurrentMonth();
    }

    @Get("SelectedSubscription")
    updateSelectedSubscriptionForPlayer(playerId, beginDate){
        return this.subscriptionsService.updateSelectedSubscriptionForPlayer(playerId, beginDate);
    }

    @Get('/:id')
    getAllForPlayer(@Param() param, @Query() {limit, page}){
        return this.subscriptionsService.getAllForPlayer(param.id, limit, page)
    }

    @Post("/new")
    subscribe(@Body() body: SubscribeRequest) {
        return this.subscriptionsService.subscribe(body);
    }
    @Post("update/:id")
    update(@Body() body, @Param() parametars){
        return this.subscriptionsService.updateDate(body, parametars.id)
    }

    
}
