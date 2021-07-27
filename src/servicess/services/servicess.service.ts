import {Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNewServiceRequest } from "../requests/createNewServiceRequest";
import {Service} from "../entities/servicess.entity";

@Injectable()
export class ServicessServices {

    // Creating player's object 
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepo:  Repository<Service>
    ) {}

    // Add New Service Method
    async newService(request : CreateNewServiceRequest){
        const newService = new Service()
        newService.name = request.name
        newService.price = request.price
        return {service: await this.serviceRepo.save(newService), message:"Service Added"}
    }

    //view all services
    async getAll(){
        const allServices = await this.serviceRepo.find()
        if(allServices.length==0){
            // there are no services ...
            return {message:"There are no services."}
        }
        return allServices
    }

    // delete a service
    async deleteService(requestId : number){
        await this.serviceRepo.remove( await this.doesServiceExist(requestId))
        return {message:"The service has been deleted."}
    }

    //edit a service
    async editService(requestId : number, request:CreateNewServiceRequest){
        const searched_service = await this.doesServiceExist(requestId)
        searched_service.name = request.name
        searched_service.price = request.price
        return this.serviceRepo.save(searched_service)

    }

    // a function to check if the element exist on the database or not
    async doesServiceExist(id:number){
        const service = await this.serviceRepo.findOne({where:{id:id}})
        if(!service){
            // the service does not exist
            throw new NotFoundException({message:"The service is not found"})
        }
        return service
    }


}