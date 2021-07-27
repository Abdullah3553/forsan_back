import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {ActivityPlayerSubscription} from "./entities/activity-playersSubscription.entity";
import {ActivityPlayersSubscriptionController} from "./controller/activity-playersSubscription.controller";
import {ActivityPlayersSubscriptionService} from "./services/activity-playersSubscription.service";
import { ActivityPlayerModule } from "src/activity-players/activity-player.module";
import { ActivitiesModule } from "src/activities/activities.module";

@Module({

    imports: [
        TypeOrmModule.forFeature([ActivityPlayerSubscription]),
        ActivityPlayerModule,
        ActivitiesModule
    ],
    controllers: [ActivityPlayersSubscriptionController],
    providers: [ActivityPlayersSubscriptionService],
    exports:[ActivityPlayersSubscriptionService]
})
export class ActivityPlayersSubscriptionModule {}
