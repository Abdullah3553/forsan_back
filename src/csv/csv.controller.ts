import {Controller, Get, Res} from '@nestjs/common';
import {CSVService} from "./csv.service";
import {Response} from "express";

@Controller('csv')
export class CsvController {
    constructor(
        private readonly csvService: CSVService
    ) {
    }

    @Get("/")
    async genPlayersExcel(@Res() response: Response) {
        const resContent = await this.csvService.forPlayers();
        response.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=players.csv'
        })
        response.end(resContent,'binary')

    }
}
