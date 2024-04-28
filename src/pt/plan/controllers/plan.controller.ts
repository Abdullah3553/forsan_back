import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
  getAll(@Query() {limit, page}) {
    return this.service.getAll(limit, page);
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
