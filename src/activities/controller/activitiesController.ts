import {Controller, Get, Post, Body, Delete, Param} from "@nestjs/common";
import { CreateNewActivityRequest } from "../requests/createNewActivity.request";
import { ActivitiesService } from "../services/activities.service";


@Controller('activities')
export class ActivitiesController {

    constructor(
        private readonly activityService : ActivitiesService
    ){}

    @Get("/")
    getAll(){
        return this.activityService.getAll();
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