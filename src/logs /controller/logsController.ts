import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwtAuthGuard";
import { LogsService } from "../service/logs.service";


@Controller('log')
@UseGuards(JwtAuthGuard)
export class logsController {

    constructor(
        private readonly logService : LogsService
    ){}

    @Get("/log")
    getAll(){
        return this.logService.getAll()
    }
}