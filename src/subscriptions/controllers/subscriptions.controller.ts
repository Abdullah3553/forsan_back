import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {SubscriptionsService} from "../services/subscriptions.service";
import {SubscribeRequest} from "../requests/subscribe.request";

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(
        private readonly subscriptionsService: SubscriptionsService
    ) {}

    @Get('/')
    getAll(){
        return this.subscriptionsService.getAll()
    }

    @Post("/new")
    subscribe(@Body() body: SubscribeRequest) {
        return this.subscriptionsService.subscribe(body);
    }
    @Post("updateDate/:id")
    updateDate(@Body() body, @Param() parametars){
        return this.subscriptionsService.updateDate(body, parametars.id)
    }

}
