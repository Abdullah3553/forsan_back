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
        return this.subscriptionsService.updateDate(
        {
            beginDate: body.beginDate,
            endDate: body.endDate,
            payedMoney: body.payedMoney,
            plan: body.plan_id
        }
        , parametars.id)
    }

}
