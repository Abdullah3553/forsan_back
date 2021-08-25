import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwtAuthGuard";
import { CreateNewActivityPlayerRequest } from "../requests/createNewActivityPlayer.request";
import { ActivityPlayersService } from "../services/activityPlayers.service";


@Controller('activityPlayer')
@UseGuards(JwtAuthGuard)
export class ActivityPlayersController {
    constructor(
        private readonly activityPlayersService: ActivityPlayersService
    ){}

    @Get('/')
    getAll(@Query() { limit, page}){
        return this.activityPlayersService.getAll(limit,page)
    }

    @Delete("/delete/:id")
    deleteActivityPlayer(@Param() params){
        return this.activityPlayersService.deleteActivityPlayer(params.id)
    }

    @Post("/new")
    newActivityPlayer(@Body() body: CreateNewActivityPlayerRequest){
        return this.activityPlayersService.newActivityPlayer(body)
    }

    @Post("/edit/:id")
    editActivityPlayer(@Body() body: CreateNewActivityPlayerRequest, @Param() params){
        return this.activityPlayersService.editActivityPlayer(body, params.id)
    }

    @Get('/search/id/:id')
    searchActivityPlayer(@Param() param){
        return this.activityPlayersService.searchById(param.id)
    }

    @Get("/search/activity/:id")
    searchByActivity(@Param() param, @Query() { limit, page}){
        return this.activityPlayersService.searchByActivity(param.id, limit, page)
    }

    @Get("/search/endedSubscriptions/:activityId")
    showEndedSubscriptions(@Param() params){
        return this.activityPlayersService.showEndedSubscriptions(params.activityId)
    }

}