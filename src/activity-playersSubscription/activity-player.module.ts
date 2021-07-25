import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { activitiesController } from "src/activities/controller/activities.controller";
import { activityPlayersController } from "./controller/activity-player.controller";
import { ActivityPlayer } from "./entities/activity-player.entity";
import { activityPlayerServices } from "./services/activity-player.service";


@Module({

    imports: [
        TypeOrmModule.forFeature([ActivityPlayer])
    ],
    controllers: [activityPlayersController],
    providers: [activityPlayerServices]    
})
export class ActivityPlayerModule{}