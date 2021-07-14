import {Controller, Get, Post, Body, UseInterceptors, UploadedFile} from "@nestjs/common";
import { createNewPlayerRequest } from "../requests/createnewplayer.request";
import { playersServices } from "../services/players.service";
import {FileInterceptor} from "@nestjs/platform-express";


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
    @UseInterceptors(FileInterceptor('photo'))
    createNewPlayer(@Body() body: createNewPlayerRequest,@UploadedFile() photo: Express.Multer.File){
        return this.playerService.createNewPlayer(body,photo);
    }

}