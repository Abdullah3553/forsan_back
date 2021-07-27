import {Controller, Get, Post, Body, Delete, Param} from "@nestjs/common";
import { CreateNewServiceRequest } from "../requests/createNewServiceRequest";
import { ServicessServices } from "../services/servicess.service";


@Controller('services')
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
    getAll(){
        return this.servicessService.getAll()
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