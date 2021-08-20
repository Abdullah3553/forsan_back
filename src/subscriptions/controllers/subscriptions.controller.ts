import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {SubscriptionsService} from "../services/subscriptions.service";
import {SubscribeRequest} from "../requests/subscribe.request";

@Controller('subscription')
export class SubscriptionsController {
    constructor(
        private readonly subscriptionsService: SubscriptionsService
    ) {}

    @Get('/')
    getAll(){
        return this.subscriptionsService.getAll()
    }

    @Post('/today')
    getAllToday(@Body('todayDate')todayDate:string){
        return this.subscriptionsService.getAllToday(todayDate)
    }

    @Get('/:id')
    getAllForPlayer(@Param() param){
        return this.subscriptionsService.getAllForPlayer(param.id)
    }

    @Post("/new")
    subscribe(@Body() body: SubscribeRequest) {
        return this.subscriptionsService.subscribe(body);
    }
    @Post("updateDate/:id")
    updateDate(@Body() body, @Param() parametars){
        return this.subscriptionsService.updateDate({beginDate: body.beginDate,
            endDate: body.endDate,
        }
        , parametars.id)
    }

}
