import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {ActivityPlayerSubscription} from "./entities/activityPlayerSubscriptions.entity";
import {ActivityPlayerSubscriptionsController} from "./controller/activityPlayerSubscriptions.controller";
import {ActivityPlayerSubscriptionsService} from "./services/activityPlayerSubscriptions.service";
import {ActivitiesModule} from "../activities/activities.module";
import {ActivityPlayersModule} from "../activityPlayers/activityPlayers.module";
import {logsModule} from "../logsModule/logs.module";

@Module({

    imports: [
        TypeOrmModule.forFeature([ActivityPlayerSubscription]),
        ActivitiesModule, ActivityPlayersModule, logsModule
    ],
    controllers: [ActivityPlayerSubscriptionsController],
    providers: [ActivityPlayerSubscriptionsService],
    exports:[ActivityPlayerSubscriptionsService]
})
export class ActivityPlayerSubscriptionsModule {}
