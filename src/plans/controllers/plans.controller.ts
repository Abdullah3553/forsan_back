import {Body, Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import {PlansService} from "../services/plans.service";
import {CreateNewPlanRequest} from "../requests/createNewPlan.request";
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';

@Controller('plan')
@UseGuards(JwtAuthGuard)
export class PlansController {

    constructor(
        private readonly plansService: PlansService
    ) {}

    @Get('/')
    getPlans() {
        return this.plansService.getAll();
    }

    @Get('/AllActive')
    getActivePlans(){
        return this.plansService.getActivePlans()
    }

    @Post('/new')
    newPlan (@Body() body: CreateNewPlanRequest) {
        return this.plansService.newPlan(body);
    }

    @Get("/activate/:id")
    activatePlan(@Param() params) {
        return this.plansService.activatePlan(params.id);
    }

    @Delete("/delete/:id")
    deletePlan(@Param() params) {
        return this.plansService.deletePlan(params.id);
    }

    @Post("/edit/:id")
    updatePlan(@Body() body: CreateNewPlanRequest, @Param() params){
        return this.plansService.updatePlan(body, params.id)
    }

    @Get("/de-activate/:id")
    De_ActivePlan(@Param() params){
        return this.plansService.deActivatePlan(params.id)
    }
    @Post("test")
    test(@Body() body){
        return this.plansService.test(body)
    }

}
