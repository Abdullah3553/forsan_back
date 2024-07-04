import {Controller, Get, Post, Body, Delete, Param, UseGuards, Query} from "@nestjs/common";
import { CreateNewServiceRequest } from "../requests/createNewServiceRequest";
import { ServicessServices } from "../services/servicess.service";
import {JwtAuthGuard} from "../../auth/guards/jwtAuthGuard";


@Controller('service')
@UseGuards(JwtAuthGuard)
export class ServicessController {

    constructor(
        private readonly servicessService : ServicessServices
    ){}

    // Add New service
    @Post('/new')
    newService(@Body() body:CreateNewServiceRequest){
        return this.servicessService.newService(body)
    }
    // View All services
    @Get('/')
    getAll(@Query() {limit, page}){
        return this.servicessService.getAll(limit, page)
    }

    @Get('/:id')
    getServiceById(@Param() params){
        return this.servicessService.getById(params.id);
    }

    //delete a service
    @Delete('/delete/:id')
    deleteService(@Param() parametars){
        return this.servicessService.deleteService(parametars.id)
    }

    // Edit a service if needed
    @Post('/edit/:id')
    editService(@Param() parametars, @Body() newData:CreateNewServiceRequest){
        return this.servicessService.editService(parametars.id, newData)
    }

}