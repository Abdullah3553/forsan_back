import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwtAuthGuard';
import { SubscriptionsService } from '../services/subscriptions.service';

@Controller('/pt/subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {

  constructor(
    protected readonly service: SubscriptionsService
  ) {}

  @Get('/')
  getAll() {
    return;
  }

//   @Get('/:id')
//   getById(@Param() param) {
//     return;
//   }

//   @Post("/")
//   create(@Body() body){
//     return ;
//   }

//   @Patch("/:id")
//   update(@Body() body, @Param() params){
//     return;
//   }

//   @Delete("/:id")
//   delete(@Param() params){
//     return;
//   }
}
