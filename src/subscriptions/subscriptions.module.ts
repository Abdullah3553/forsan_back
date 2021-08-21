import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Subscription} from "./entities/subscriptions.entity";
import { SubscriptionsService } from './services/subscriptions.service';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import {PlayersModule} from "../players/players.module";
import {PlansModule} from "../plans/plans.module";
import {PartialSubscriptionsService} from "./services/partialSubscriptions.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Subscription]),
        PlayersModule ,
        forwardRef(()=>PlansModule)
    ],
    providers: [SubscriptionsService, PartialSubscriptionsService],
    controllers: [SubscriptionsController],
    exports:[PartialSubscriptionsService, SubscriptionsService]
})
export class SubscriptionsModule {}
