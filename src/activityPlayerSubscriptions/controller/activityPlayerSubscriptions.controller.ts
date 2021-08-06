import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import {CreateNewActivityPlayerSubscriptionRequest} from "../requests/createNewActivityPlayerSubscription.request"
import {ActivityPlayerSubscriptionsService} from "../services/activityPlayerSubscriptions.service";



@Controller('activityPlayerSubscription')
export class ActivityPlayerSubscriptionsController {
    constructor(
        private readonly activityPlayerSubService: ActivityPlayerSubscriptionsService
    ){}

    @Get('/')
    getAll(@Query() { limit, page}){
        
        return this.activityPlayerSubService.getAll(limit,page)
    }
    @Get('/:id')
    getSingleActivityPlayer(@Param() param){
        return this.activityPlayerSubService.getSinglePlayer(param.id)
    }

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
}