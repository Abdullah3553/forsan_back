import {Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNewServiceRequest } from "../requests/createNewServiceRequest";
import {Service} from "../entities/servicess.entity";
import { LogsService } from "../../logsModule/service/logs.service";
import { UserContextService } from "../../dataConfig/userContext/user-context.service";
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class ServicessServices {

    // Creating player's object
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepo:  Repository<Service>,
        private readonly logsService: LogsService,
        private readonly userContextService: UserContextService
    ) {}

    // Add New Service Method
    async newService(request : CreateNewServiceRequest){
        const newService = new Service()
        newService.name = request.name
        newService.price = request.price
        const item = await this.serviceRepo.save(newService)
        await this.logsService.createNewLog(item.id, `added new ${request.name} service`, "services")

        return item
    }

    //view all services
    async getAll(){
        return await this.serviceRepo.find()
    }

    // delete a service
    async deleteService(requestId : number){
        const item = await this.doesServiceExist(requestId)
        await this.logsService.createNewLog(requestId, `deleted ${item.name} service`, "service")
        await this.serviceRepo.remove(item)
        return {message:"The service has been deleted."}
    }

    //edit a service
    async editService(requestId : number, request:CreateNewServiceRequest){
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        const searched_service = await this.doesServiceExist(requestId)
        await this.logsService.createNewLog(requestId, `edited ${request.name} service`, "service")
        bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} edited the session price from ${searched_service.price} to ${request.price}`);
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
