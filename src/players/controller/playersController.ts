import {Controller, Get, Post, Body, UseInterceptors, UploadedFile, Param, Delete} from "@nestjs/common";
import { CreateNewPlayerRequest } from "../requests/createNewPlayerRequest";
import { PlayersServices } from "../services/players.service";
import {FileInterceptor} from "@nestjs/platform-express";


@Controller('players')
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
    @UseInterceptors(FileInterceptor('photo'))
    createNewPlayer(@Body() body: CreateNewPlayerRequest, @UploadedFile() photo: Express.Multer.File){
        return this.playersService.newPlayer(body,photo);
    }

    @Post("/edit/:id")
    editPlayer(@Body() body: CreateNewPlayerRequest, @Param() params){
        return this.playersService.editPlayer(body, params.id);
    }

    @Delete("/delete/:id")
    deletePlayer(@Param() params){
        return this.playersService.deletePlayer(params.id)
    }

    // TODO create an endpoint just for updating the photo
    
}
