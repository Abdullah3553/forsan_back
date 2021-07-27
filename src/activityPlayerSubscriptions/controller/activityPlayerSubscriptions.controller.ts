import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {CreateNewActivityPlayerSubscriptionRequest} from "../requests/createNewActivityPlayerSubscription.request"
import {ActivityPlayerSubscriptionsService} from "../services/activityPlayerSubscriptions.service";



@Controller('activityPlayerSubscription')
export class ActivityPlayerSubscriptionsController {
    constructor(
        private readonly activityPlayerSubService: ActivityPlayerSubscriptionsService
    ){}

    @Get('/')
    getAll(){
        return this.activityPlayerSubService.getAll()
    }

    @Post('/new')
    newSubscription(@Body() body:CreateNewActivityPlayerSubscriptionRequest){
        return this.activityPlayerSubService.newSubscription(body)
    }


    @Post('/updateDate/:id')
    updateDate(@Body() body, @Param() parametars){
        return this.activityPlayerSubService.updateSubDate(body, parametars.id)
    }
}