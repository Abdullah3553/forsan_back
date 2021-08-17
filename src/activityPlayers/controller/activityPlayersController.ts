import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
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
    getAll(){
        return this.activityPlayersService.getAll()
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

}