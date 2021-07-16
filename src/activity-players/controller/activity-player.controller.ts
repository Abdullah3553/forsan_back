import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { addNewActPlayer } from "../requests/add-new-act-player.request";
import { activityPlayerServices } from "../services/activity-player.service";


@Controller('activity-player')
export class activityPlayersController{
    constructor(
        private readonly actPlayerService: activityPlayerServices
    ){}

    @Get()
    getAllActivityPlayers(){
        return this.actPlayerService.getAll()
    }

    @Delete("/delete-activity-player/:id")
    deleteActPlayer(@Param() params){
        return this.actPlayerService.deleteActPlayer(params.id)
    }

    @Post("/new-Activity-player")
    createNewActPlayer(@Body() body: addNewActPlayer){
        return this.actPlayerService.createNewActPlayer(body)
    }

    @Post("/Edit-Activity-player/:id")
    editActivityPlayer(@Body() body: addNewActPlayer, @Param() params){
        return this.actPlayerService.EditActPlayer(body, params.id)
    }

}