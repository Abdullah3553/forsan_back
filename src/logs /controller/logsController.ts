import {Body, Controller, Get, Post, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "src/auth/guards/jwtAuthGuard";
import {LogsService} from "../service/logs.service";


@Controller('log')
@UseGuards(JwtAuthGuard)
export class logsController {

    constructor(
        private readonly logService : LogsService
    ){}

    @Get("/today")
    getToday(){
        return this.logService.getAll()
    }

    @Post("/at")
    getLogsAt(@Body() body) {
        return this.logService.getAt(body)
    }

}