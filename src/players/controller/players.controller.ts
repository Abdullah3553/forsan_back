import { Controller, Get, Post, Body } from "@nestjs/common";
import { createNewPlayerRequest } from "../requests/createnewplayer.request";
import { playersServices } from "../services/players.service";


@Controller('players')
export class playersController{

    constructor(
        private readonly playerService : playersServices
    ){}

    @Get("/getAll")
    getAllPlayers(){
        return this.playerService.getAll();
    }

    @Post("/newPlayer")
    CreateNewPlayer(@Body() body: createNewPlayerRequest){
        return this.playerService.createNewPlayer(body);
    }

}