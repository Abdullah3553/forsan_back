import {Controller, Get, Post, Body, UseInterceptors, UploadedFile, Param, Delete} from "@nestjs/common";
import { createNewPlayerRequest } from "../requests/createnewplayer.request";
import { PlayersServices } from "../services/players.service";
import {FileInterceptor} from "@nestjs/platform-express";


@Controller('players')
export class playersController{

    constructor(
        private readonly playerService : PlayersServices
    ){}

    @Get("/getAll")
    getAllPlayers(){
        return this.playerService.getAll();
    }

    @Get ("/viewPlayer/:id")
    viewPlayer(@Param() params){
        return this.playerService.viewPlayer(params.id);
    }

    @Post("/newPlayer")
    @UseInterceptors(FileInterceptor('photo'))
    createNewPlayer(@Body() body: createNewPlayerRequest,@UploadedFile() photo: Express.Multer.File){
        return this.playerService.createNewPlayer(body,photo);
    }

    @Post("/editPlayer/:id")
    editPlayer(@Body() body: createNewPlayerRequest, @Param() params){
        return this.playerService.EditPlayer(body, params.id);
    }

    @Delete("/delete-player/:id")
    deletePlayer(@Param() params){
        return this.playerService.deletePlayer(params.id)
    }

    // TODO create an endpoint just for updating the photo
    
}

