import { Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {ServiceIncome} from "../entities/services_income.entity";
import * as moment from 'moment'
import {servicessServices} from "../../servicess/services/servicess.service";
import {Service} from "../../servicess/entities/servicess.entity";

@Injectable()
export class services_incomeService{

    constructor(
        @InjectRepository(ServiceIncome)
        private readonly service_incomeRepo: Repository<ServiceIncome>,
        private readonly servicessService : servicessServices
    ) {}

    getTodayServiceIncome(){
        const todayDate = moment().format("yyyy-MM-DD")
        return this.service_incomeRepo.find({where:{dayDate:todayDate}})
    }

    async buyService(requestId:number){
        // search for service_id = requsetId
        const serviceIncome = await this.doesServiceIncomeExist(requestId)
        serviceIncome.soldItems+=1
        return this.service_incomeRepo.save(serviceIncome)

    }

    async doesServiceIncomeExist(id:number){
        const service = await this.servicessService.doesExist(id)
        let serviceIncome = await this.service_incomeRepo.findOne({where:{service:service}})
        if(!serviceIncome){
            // service does not exist
            // then add the serviceIncome to table
            serviceIncome = await this.addServiceIncome(service)
        }
        // Service is ready
        return serviceIncome
    }

     addServiceIncome(service:Service){
        // service never sold today
        const serviceIncome = new ServiceIncome()
        serviceIncome.dayDate = moment().format("yyyy-MM-DD")
        serviceIncome.service = service

        return this.service_incomeRepo.save(serviceIncome)

    }

}