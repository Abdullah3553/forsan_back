import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwtAuthGuard';
import { SubscriptionsService } from '../services/subscriptions.service';
import { CreateSubscriptionRequest } from '../requests/createSubscriptionRequest';
import { UpdateSubscriptionRequest } from '../requests/updateSubscriptionRequest';

@Controller('/pt/subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {

  constructor(
    protected readonly service: SubscriptionsService
  ) {}

  @Get("/")
  getAll(@Query() {limit, page}){
      return this.service.getAll(limit, page);
  }


  @Get('/coach/:id')
  getByCoachId(@Param() param, @Query() {limit, page}) {
      return this.service.findByCoachId(param.id, limit, page);
  }

  @Get('/player/:id')
  getByPlayerId(@Param() param, @Query() {limit, page}) {
      return this.service.findByPlayerId(param.id, limit, page);
  }

  @Post("/")
  create(@Body() body: CreateSubscriptionRequest){
      return this.service.create(body);
  }

  @Patch("/:id")
  update(@Body() body: UpdateSubscriptionRequest, @Param() params){
      return this.service.update(body, params.id);
  }

  @Get('/:id')
  getById(@Param() param) {
      return this.service.findById(param.id);
  }

  @Delete("/:id")
  delete(@Param() params){
      return this.service.delete(params.id);
  }
}
