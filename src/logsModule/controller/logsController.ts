import {Body, Controller, Delete, Get, Post, Query, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../../auth/guards/jwtAuthGuard";
import {LogsService} from "../service/logs.service";


@Controller('log')
@UseGuards(JwtAuthGuard)
export class logsController {

    constructor(
        private readonly logService : LogsService
    ){}

    @Get("/today")
    getToday(@Query() { limit, page}){
        return this.logService.getAll(limit,page)
    }

    @Get("/signedin")
    getTodaySignedinPlayers(){
        return this.logService.getSignedIn();
    }

    @Post("/at")
    getLogsAt(@Body() body,@Query() { limit, page}) {
        return this.logService.getAt(body,limit,page)
    }

    @Delete("/deleteAll")
    deleteAllLogs(){
        return this.logService.deleteAll()
    }

    @Delete("/deleteSelectedTime")
    deleteSelectedTime(@Body() body){
        return this.logService.deleteSelectedTime(body.beginDate, body.endDate)
    }
}
