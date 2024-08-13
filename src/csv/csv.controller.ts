import { Controller, Get, Query, Res } from '@nestjs/common';
import {CSVService} from "./csv.service";
import {Response} from "express";

@Controller('csv')
export class CsvController {
    constructor(
        private readonly csvService: CSVService
    ) {
    }

    @Get("/")
    async genPlayersExcel(@Res() response: Response, @Query('searchElement') searchElement, @Query('searchOption') searchOption ) {
        const resContent = await this.csvService.forPlayers(searchElement, searchOption);
        response.writeHead(200, {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename=players.csv'
        })
        response.end(resContent,'utf-8')

    }
}
