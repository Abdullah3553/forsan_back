import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {PlansService} from "../services/plans.service";
import {CreatePlanRequest} from "../requests/createPlan.request";

@Controller('plans')
export class PlansController {

    constructor(
        private readonly plansService: PlansService
    ) {}

    @Get()
    getPlans() {
        return this.plansService.getAll();
    }

    @Post()
    createPlan (@Body() body: CreatePlanRequest) {
        return this.plansService.createPlan(body);
    }

}
