import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { activitiesController } from "./controller/activities.controller";
import { activityServices } from "./services/activities.service";
import {Activity} from "./entities/activity.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Activity]),
    ],
    controllers: [activitiesController],
    providers: [activityServices],
    exports:[activityServices]
})
export class ActivitiesModule {}