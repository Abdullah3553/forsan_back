import {Controller, Get, Post, Body, Param, Delete, UseGuards, Query} from "@nestjs/common";
import { CreateNewPlayerRequest } from "../requests/createNewPlayerRequest";
import { PlayersServices } from "../services/players.service";
import {JwtAuthGuard} from "../../auth/guards/jwtAuthGuard";


@Controller('player')
@UseGuards(JwtAuthGuard)
export class PlayersController {

    constructor(
        private readonly playersService : PlayersServices
    ){}

    @Get("/")
    getAll(@Query() {limit, page}){
        return this.playersService.getAll(limit, page);
    }

    @Get("/SignedInPlayers")
    getSignedInData(@Query() {limit, page}){
        return this.playersService.getSignedinPlayersData(limit, page);
    }

    @Get('/number')
    getPlayersNumber(){
        return this.playersService.getPlayersNumber()
    }

    @Get("/:id")
    viewPlayer(@Param() params){
        return this.playersService.viewPlayer(params.id);
    }

    @Post("/new")
    createNewPlayer(@Body() body: CreateNewPlayerRequest){
        return this.playersService.newPlayer(body);
    }

    @Post("/inviteFriend/:id")
    inviteFriend(@Param() parameters, @Body() body){
        return this.playersService.inviteFriend(parameters.id, body.invites)
    }

    @Post("/freeze/:id")
    freezePlayer(@Param() parameters, @Body() body){
        return this.playersService.freezePlayer(parameters.id, body.freezeDays)
    }

    @Post("/test")
    async test(@Body() body, @Query() {limit, page}){
            return await this.playersService.searchByOption(body.searchElement, body.searchOption, limit, page)
    }

    @Post("/search")
    async search(@Body() body, @Query() {limit, page}){
        return await this.playersService.searchByOption(body.searchElement, body.searchOption, limit, page)
    }

    @Post("/edit/:id")
    editPlayer(@Body() body: CreateNewPlayerRequest, @Param() params){
        return this.playersService.editPlayer(body, params.id);
    }

    @Delete("/delete/:id")
    deletePlayer(@Param() params){
        return this.playersService.deletePlayer(params.id)
    }

    @Get("/active")
    getActiveUsers(@Query() {limit, page}){
        return this.playersService.getAllActive(limit, page);
    }

}

