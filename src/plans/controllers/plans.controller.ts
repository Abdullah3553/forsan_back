import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
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

    @Get('/AllActive')
    getActivePLans(){
        return this.plansService.getActivePlans()
    }

    @Post()
    createPlan (@Body() body: CreatePlanRequest) {
        return this.plansService.createPlan(body);
    }

    @Get("/activate/:id")
    activatePlan(@Param() params) {
        return this.plansService.activatePlan(params.id);
    }

    @Delete(":id")
    deletePlan(@Param() params) {
        return this.plansService.deletePlan(params.id);
    }

    @Post("/update-plan/:id")
    updatePlan(@Body() body: CreatePlanRequest, @Param() params){
        return this.plansService.updatePlan(body, params.id)
    }

    @Get("/de-activate/:id")
    De_ActivePlan(@Param() params){
        return this.plansService.deActivatePlan(params.id)
    }

}
