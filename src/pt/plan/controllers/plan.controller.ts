import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwtAuthGuard';
import { PlanService } from '../services/plan.service';

@Controller('/pt/plans')
// @UseGuards(JwtAuthGuard)
export class PlanController {

  constructor(
    protected readonly service: PlanService
  ) {}

  @Get('/')
  getAll() {
    return this.service.getAll();
  }

}
