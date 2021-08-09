import { Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {ServiceIncome} from "../entities/servicesIncome.entity";
import * as moment from 'moment'
import {ServicessServices} from "../../servicess/services/servicess.service";
import {Service} from "../../servicess/entities/servicess.entity";

@Injectable()
export class ServicesIncomeService {

    constructor(
        @InjectRepository(ServiceIncome)
        private readonly serviceIncomeRepo: Repository<ServiceIncome>,
        private readonly servicessService : ServicessServices
    ) {}

    getTodayServiceIncome(){
        const todayDate = moment().format("yyyy-MM-DD")
        return this.serviceIncomeRepo.find({where:{dayDate:todayDate}})
    }

    async buyService(requestId:number){
        // search for service_id = requestId
        const serviceIncome = await this.doesServiceIncomeExist(requestId)
        serviceIncome.soldItems+=1
        return this.serviceIncomeRepo.save(serviceIncome)

    }
        
    async doesServiceIncomeExist(id:number){
        const service = await this.servicessService.doesServiceExist(id)
        let serviceIncome = await this.serviceIncomeRepo.findOne(
            {
                where:{
                    service:service,
                    dayDate : moment().format("yyyy-MM-DD")
                }
            })
        if(!serviceIncome){
            // service does not exist
            // then add the servicesIncome to table
            serviceIncome = await this.addServiceIncome(service)
        }
        // Service is ready
        return serviceIncome
    }

     addServiceIncome(service:Service){
        // service never sold today
        const serviceIncome = new ServiceIncome()
        serviceIncome.dayDate = moment().format("yyyy-MM-DD")
         serviceIncome.payedMoeny = service.price
        serviceIncome.service = service

        return this.serviceIncomeRepo.save(serviceIncome)

    }

}