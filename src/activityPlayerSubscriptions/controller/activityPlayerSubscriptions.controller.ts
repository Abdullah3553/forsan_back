import {Body, Controller, Get, Param, Post, Query, UseGuards} from "@nestjs/common";
import {CreateNewActivityPlayerSubscriptionRequest} from "../requests/createNewActivityPlayerSubscription.request"
import {ActivityPlayerSubscriptionsService} from "../services/activityPlayerSubscriptions.service";
import {JwtAuthGuard} from "../../auth/guards/jwtAuthGuard";

@UseGuards(JwtAuthGuard)
@Controller('activityPlayerSubscription')
export class ActivityPlayerSubscriptionsController {
    constructor(
        private readonly activityPlayerSubService: ActivityPlayerSubscriptionsService
    ){}




    @Post('/new')
    newSubscription(@Body() body:CreateNewActivityPlayerSubscriptionRequest){
        return this.activityPlayerSubService.newSubscription(body)
    }

    @Get("detailedIncome")
    getDetailedIncome(){
      return this.activityPlayerSubService.getDetailedIncome();
    }

    @Get("TotalIncome")
    getTodayIncome(){
        return this.activityPlayerSubService.getTodayIncome();
    }

    @Post('/updateDate/:id')
    updateDate(@Body() body, @Param() parametars){
        return this.activityPlayerSubService.updateSubDate(body, parametars.id)
    }

    @Post('/edit/:id')
    editActivityPlayerSubscription(@Body() body, @Param() parametars){
        return this.activityPlayerSubService.editSubscription(body, parametars.id)
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
