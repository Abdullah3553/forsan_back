import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {ServiceIncome} from "../entities/services_income.entity";
import * as moment from 'moment'

@Injectable()
export class services_incomeService{

    constructor(
        @InjectRepository(ServiceIncome)
        private readonly service_incomeRepo: Repository<ServiceIncome>
    ) {}

    getTodayServiceIncome(){
        const todayDate = moment().format("yyyy-MM-DD")
        return this.service_incomeRepo.find({where:{dayDate:todayDate}})
    }

    async addServiceIncome(requestId:number){
        // search for service_id = requsetId
        const serviceIncome = await this.doesServiceIncomeExist(requestId)
        serviceIncome.soldItems+=1
        return this.service_incomeRepo.save(serviceIncome)

    }

    async doesServiceIncomeExist(id:number){
        let serviceIncome = await this.service_incomeRepo.findOne({where:{service_id:id}})
        if(!serviceIncome){
            // service does not exist
            // then add the serviceIncome to table
            serviceIncome = await this.addServiceIncomeTable(id)
        }
        // Service is ready
        return serviceIncome
    }

    addServiceIncomeTable(serviceIncomeId:number){
        const serviceIncome = new ServiceIncome()
        serviceIncome.dayDate = moment().format("yyyy-MM-DD")
        serviceIncome.soldItems = 1


        return this.service_incomeRepo.save(serviceIncome)

    }

}