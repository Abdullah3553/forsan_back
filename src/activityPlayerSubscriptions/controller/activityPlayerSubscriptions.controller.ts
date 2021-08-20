import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import {CreateNewActivityPlayerSubscriptionRequest} from "../requests/createNewActivityPlayerSubscription.request"
import {ActivityPlayerSubscriptionsService} from "../services/activityPlayerSubscriptions.service";


@Controller('activityPlayerSubscription')
export class ActivityPlayerSubscriptionsController {
    constructor(
        private readonly activityPlayerSubService: ActivityPlayerSubscriptionsService
    ){}




    @Post('/new')
    newSubscription(@Body() body:CreateNewActivityPlayerSubscriptionRequest){
        return this.activityPlayerSubService.newSubscription(body)
    }


    @Post('/updateDate/:id')
    updateDate(@Body() body, @Param() parametars){
        return this.activityPlayerSubService.updateSubDate(body, parametars.id)
    }

    @Get('/today')
    getToday(){

        return this.activityPlayerSubService.todaySubscriptions()
    }

    @Get('/:id')
    getAll(@Query() { limit, page}, @Param() params){
        return this.activityPlayerSubService.getSinglePlayer(limit,page,params.id)
    }


}
