import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Subscription} from "../entities/subscription.entity";
import {Repository} from "typeorm";
import {SubscribeRequest} from "../requests/subscribe.request";
import {PlayersServices} from "../../players/services/players.service";
import {PlansService} from "../../plans/services/plans.service";

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionsRepo : Repository<Subscription>,
        private readonly playersService : PlayersServices,
        private readonly plansService: PlansService
    ) {}

    // create subscriptions or renew subscriptions
    // both will add new row in the table
    async subscribe(request: SubscribeRequest) {
        const player = await this.playersService.viewPlayer(request.player_id);
        const plan = await this.plansService.checkPlanExist(request.plan_id);
        const subscribtion = new Subscription();
        subscribtion.player = player;
        subscribtion.plan = plan
        subscribtion.beginDate = request.beginDate
        subscribtion.endDate = request.endDate
        subscribtion.price = plan.price
        return await this.subscriptionsRepo.save(subscribtion);
    }



}
