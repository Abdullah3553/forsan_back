import {Controller, Get, Post, Body, Delete, Param, UseGuards, Query} from "@nestjs/common";
import { CreateNewActivityRequest } from "../requests/createNewActivity.request";
import { ActivitiesService } from "../services/activities.service";
import {JwtAuthGuard} from "../../auth/guards/jwtAuthGuard";


@Controller('activity')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {

    constructor(
        private readonly activityService : ActivitiesService
    ){}

    @Get("/")
    getAll(@Query() {limit, page}){
        return this.activityService.getAll(limit, page);
    }

    @Post('/new')
    newActivity(@Body() body:CreateNewActivityRequest){
        return this.activityService.newActivity(body)
    }

    @Delete('/delete/:id')
    deleteActivity(@Param() parametars){
        return this.activityService.deleteActivity(parametars.id)
    }

    @Post('/edit/:id')
    editActivity(@Body() body : CreateNewActivityRequest, @Param() parametars ){
        return this.activityService.editActivity(body, parametars.id)
    }

    @Get('view/:id')
    viewActivityById(@Param() parametars){
        return this.activityService.viewById(parametars.id)
    }


}
