import {Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { createNewServiceRequest } from "../requests/CreateNewService.request";
import {Service} from "../entities/servicess.entity";

@Injectable()
export class servicessServices{

    // Creating player's object 
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepo:  Repository<Service>
    ) {}

    // Add New Service Method
    addNewService(request : createNewServiceRequest){
        const newService = new Service()
        newService.name = request.name
        newService.price = request.price
        return this.serviceRepo.save(newService)
    }

    //view all services
    viewAllServices(){
        return this.serviceRepo.find()
    }

    // delete a service
    deleteService(requsetId : number){
        return this.serviceRepo.delete(requsetId)
    }

    //edit a service
    async editService(requsetId : number, request:createNewServiceRequest){
        const searched_service = await this.doesExist(requsetId)
        searched_service.name = request.name
        searched_service.price = request.price
        await this.serviceRepo.save(searched_service)
        return {message:'The service has been Edited'}

    }

    //private functions

    // a function to check if the element exist on the database or not
    private async doesExist(id:number){
        const service = await this.serviceRepo.findOne({where:{id:id}})
        if(!service){
            // the service does not exist
            throw new NotFoundException({message:"The service is not found"})
        }
        return service
    }


}