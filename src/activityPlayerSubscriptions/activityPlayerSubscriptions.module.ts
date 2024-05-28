import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {ActivityPlayerSubscription} from "./entities/activityPlayerSubscriptions.entity";
import {ActivityPlayerSubscriptionsController} from "./controller/activityPlayerSubscriptions.controller";
import {ActivityPlayerSubscriptionsService} from "./services/activityPlayerSubscriptions.service";
import {ActivitiesModule} from "../activities/activities.module";
import {ActivityPlayersModule} from "../activityPlayers/activityPlayers.module";
import {logsModule} from "../logsModule/logs.module";
import { UserContextModule } from "../dataConfig/userContext/user-context.module";

@Module({

    imports: [
        TypeOrmModule.forFeature([ActivityPlayerSubscription]),
        ActivitiesModule, ActivityPlayersModule, logsModule,
        UserContextModule
    ],
    controllers: [ActivityPlayerSubscriptionsController],
    providers: [ActivityPlayerSubscriptionsService],
    exports:[ActivityPlayerSubscriptionsService]
})
export class ActivityPlayerSubscriptionsModule {}
