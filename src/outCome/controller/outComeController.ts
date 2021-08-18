import {Controller, Get, Post, Body, Delete, Param, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../../auth/guards/jwtAuthGuard";
import { CreateNewOutComeRequest } from "../requests/createNewOutcome.request";
import { OutComeService } from "../services/outCome.service";


@Controller('outCome')
@UseGuards(JwtAuthGuard)
export class outComeController {

    constructor(
        private readonly outComeService : OutComeService
    ){}

    @Get("/")
    getAll(){
        return this.outComeService.getAll();
    }

    @Post('/new')
    newOutCome(@Body() body:CreateNewOutComeRequest){
        return this.outComeService.newOutCome(body)
    }

    @Delete('/delete/:id')
    deleteOutCome(@Param() param){
        return this.outComeService.deleteOutCome(param.id)
    }

    @Post('/edit/:id')
    editOutCome(@Body() body : CreateNewOutComeRequest, @Param() param){
        return this.outComeService.editOutCome(param.id, body)
    }
}
