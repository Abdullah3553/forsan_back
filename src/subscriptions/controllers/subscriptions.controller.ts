import {Body, Controller, Post} from '@nestjs/common';
import {SubscriptionsService} from "../services/subscriptions.service";
import {SubscribeRequest} from "../requests/subscribe.request";

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(
        private readonly subscriptionsService: SubscriptionsService
    ) {}

    @Post("/subscribe")
    subscribePlayer(@Body() body: SubscribeRequest) {
        return this.subscriptionsService.subscribe(body);
    }

}
