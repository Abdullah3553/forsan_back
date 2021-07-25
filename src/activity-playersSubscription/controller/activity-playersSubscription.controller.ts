import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { addNewActPlayer } from "../requests/add-new-act-playerSubscription.request";
import {ActivityPlayersSubscriptionService} from "../services/activity-playersSubscription.service";


@Controller('activity-playerSub')
export class ActivityPlayersSubscriptionController{
    constructor(
        private readonly actPlayerSubService: ActivityPlayersSubscriptionService
    ){}

    @Get('')
    seeAll(){
        return
    }
}