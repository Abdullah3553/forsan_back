import {Controller, Get, Post, Body, UseInterceptors, UploadedFile, Param, Delete} from "@nestjs/common";
import { CreateNewPlayerRequest } from "../requests/createNewPlayerRequest";
import { PlayersServices } from "../services/players.service";
import {FileInterceptor} from "@nestjs/platform-express";


@Controller('player')
export class PlayersController {

    constructor(
        private readonly playersService : PlayersServices
    ){}

    @Get("/")
    getAll(){
        return this.playersService.getAll();
    }

    @Get("/:id")
    viewPlayer(@Param() params){
        return this.playersService.viewPlayer(params.id);
    }

    @Post("/new")
    createNewPlayer(@Body() body: CreateNewPlayerRequest){
        return this.playersService.newPlayer(body);
    }

    @Post("/edit/:id")
    editPlayer(@Body() body: CreateNewPlayerRequest, @Param() params){
        return this.playersService.editPlayer(body, params.id);
    }

    @Delete("/delete/:id")
    deletePlayer(@Param() params){
        return this.playersService.deletePlayer(params.id)
    }

    @Post("/inviteFriend/:id")
    inviteFriend(@Param() parameters, @Body() body){
        return this.playersService.inviteFriend(parameters.id, body.invites)
    }

    @Post("/freeze/:id")
    freezePlayer(@Param() parameters, @Body() body){
        return this.playersService.freezePlayer(parameters.id, body.freezeDays)
    }

    @Post("test")
    test(@Body() body){
        return this.playersService.resetFreezeAndInvites(body.id)
    }

    // TODO create an endpoint just for updating the photo
    
}

