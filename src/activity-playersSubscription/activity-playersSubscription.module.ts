import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { activitiesController } from "src/activities/controller/activities.controller";
import { activityPlayersController } from "./controller/activity-playersSubscription.controller";
import { ActivityPlayer } from "./entities/activity-playersSubscription.entity";
import { activityPlayerServices } from "./services/activity-playersSubscription.service";


@Module({

    imports: [
        TypeOrmModule.forFeature([ActivityPlayer])
    ],
    controllers: [activityPlayersController],
    providers: [activityPlayerServices]    
})
export class ActivityPlayersSubscriptionModule {}