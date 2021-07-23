import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Subscription} from "./entities/subscription.entity";
import { SubscriptionsService } from './services/subscriptions.service';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import {PlayersModule} from "../players/players.module";
import {PlansModule} from "../plans/plans.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Subscription]),
        forwardRef(()=>PlayersModule),
        PlansModule
    ],
    providers: [SubscriptionsService],
    controllers: [SubscriptionsController],
    exports:[SubscriptionsService]
})
export class SubscriptionsModule {}
