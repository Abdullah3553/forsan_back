import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwtAuthGuard';
import { PlanService } from '../services/plan.service';
import { CreateNewPtPlanRequest } from '../requests/createNewPtPlanRequest';
import { UpdatePtPlanRequest } from '../requests/updatePtPlanRequest';

@Controller('/pt/plans')
@UseGuards(JwtAuthGuard)
export class PlanController {

  constructor(
    protected readonly service: PlanService
  ) {}

  @Get('/')
  getAll() {
    return this.service.getAll();
  }

  @Get('/:id')
  getById(@Param() param) {
    return this.service.findById(param.id);
  }

  @Post("/")
  create(@Body() body: CreateNewPtPlanRequest){
    return this.service.create(body);
  }

  @Patch("/:id")
  update(@Body() body: UpdatePtPlanRequest, @Param() params){
    return this.service.update(body, params.id);
  }

  @Delete("/:id")
  delete(@Param() params){
    return this.service.delete(params.id);
  }
}
