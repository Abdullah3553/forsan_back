import {Controller, Get, Post, Body, Delete, Param} from "@nestjs/common";
import { createNewServiceRequest } from "../requests/CreateNewService.request";
import { servicessServices } from "../services/servicess.service";


@Controller('services')
export class servicessController {

    constructor(
        private readonly servicessService : servicessServices
    ){}

    // Add New service
    @Post('/new')
    newService(@Body() body:createNewServiceRequest){
        return this.servicessService.addNewService(body)
    }
    // View All services
    @Get()
    AllServices(){
        return this.servicessService.viewAllServices()
    }

    //delete a service
    @Delete('/delete/:id')
    deleteService(@Param() parametars){
        return this.servicessService.deleteService(parametars.id)
    }

    // Edit a service if needed
    @Post('edit/:id')
    editService(@Param() parametars, @Body() newData:createNewServiceRequest){
        return this.servicessService.editService(parametars.id, newData)
    }

}