import {Controller, Get, Post, Body, Delete, Param} from "@nestjs/common";
import { createNewActivityRequest } from "../requests/CreateNewActivity.request";
import { activityServices } from "../services/activities.service";


@Controller('activities')
export class activitiesController {

    constructor(
        private readonly activityrService : activityServices
    ){}

    @Get("/getAll")
    getAllActivities(){
        return this.activityrService.getAll();
    }

    @Post('/new')
    newActivity(@Body() body:createNewActivityRequest){
        return this.activityrService.creatActivity(body)
    }

    @Delete('/delete/:id')
    deleteActivity(@Param() parametars){
        return this.activityrService.deleteActivity(parametars.id)
    }

    @Post('/edit/:id')
    editActivity(@Body() body : createNewActivityRequest, @Param() parametars ){
        return this.activityrService.editActivity(body, parametars.id)
    }

    @Get('view/:id')
    viewActivityById(@Param() parametars){
        return this.activityrService.viewById(parametars.id)
    }


}