import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Plan} from "../entities/plan.entity";
import {Repository} from "typeorm";
import {isNumber} from "util";
import {CreatePlanRequest} from "../requests/createPlan.request";

@Injectable()
export class PlansService {

    constructor(
        @InjectRepository(Plan)
        private readonly plansRepo:  Repository<Plan>
    ) {}

    getAll () {
        // return all plans
        // select * from plans
        return this.plansRepo.find();
    }

    createPlan (req: CreatePlanRequest) {
        // store plan
        const newPlan = new Plan()
        newPlan.name = req.name
        newPlan.price = req.price
        newPlan.description = req.description
        newPlan.isActivated = req.isActivated
        return this.plansRepo.save(newPlan)
    }

    updatePlan () {}

    deletePlan () {}

    activatePLan () {}

    deActivatePlan () {}

}
