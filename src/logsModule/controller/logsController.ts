import {Body, Controller, Get, Post, Query, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "src/auth/guards/jwtAuthGuard";
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

    @Post("/at")
    getLogsAt(@Body() body,@Query() { limit, page}) {
        return this.logService.getAt(body,limit,page)
    }

}
