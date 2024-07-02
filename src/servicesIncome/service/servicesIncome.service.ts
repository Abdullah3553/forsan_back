import { Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {ServiceIncome} from "../entities/servicesIncome.entity";
import {ServicessServices} from "../../servicess/services/servicess.service";
import {Service} from "../../servicess/entities/servicess.entity";
import {LogsService} from "../../logsModule/service/logs.service";
import * as TelegramBot from 'node-telegram-bot-api';
import { UserContextService } from "../../dataConfig/userContext/user-context.service";

@Injectable()
export class ServicesIncomeService {

    constructor(
        @InjectRepository(ServiceIncome)
        private readonly serviceIncomeRepo: Repository<ServiceIncome>,
        private readonly servicessService : ServicessServices,
        private readonly logsService: LogsService,
        private readonly userContextService: UserContextService
    ) {}

    getTodayServiceIncome(todayDate:string){
        return this.serviceIncomeRepo.find({where:{dayDate:todayDate}})
    }

    async buyService(requestId:number, todayDate:string, quantity:number){
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        quantity = Number(quantity)
        quantity = quantity || 1
        const service = await this.servicessService.doesServiceExist(requestId)
        // search for service_id = requestId
        const serviceIncome = await this.doesServiceIncomeExist(requestId, todayDate, service)
        serviceIncome.soldItems+=quantity
        const item = await this.serviceIncomeRepo.save(serviceIncome)
        await this.logsService.createNewLog(item.id, `purchased new service ${service.name}`, "services")
        bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} sold a new session`);
        return item
    }

    async doesServiceIncomeExist(id:number, todayDate:string, service:Service){
        let serviceIncome = await this.serviceIncomeRepo.findOne(
            {
                where:{
                    service:service,
                    dayDate : todayDate
                }
            })
        if(!serviceIncome){
            // service does not exist
            // then add the servicesIncome to table
            serviceIncome = await this.addServiceIncome(service, todayDate)
        }
        // Service is ready
        return serviceIncome
    }

     addServiceIncome(service:Service, todayDate:string){
        // service never sold today
        const serviceIncome = new ServiceIncome()
        serviceIncome.dayDate = todayDate
         serviceIncome.payedMoney = service.price
        serviceIncome.service = service
         serviceIncome.serviceName = service.name

        return this.serviceIncomeRepo.save(serviceIncome)

    }

}
