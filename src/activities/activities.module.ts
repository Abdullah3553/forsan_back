import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ActivitiesController } from "./controller/activitiesController";
import { ActivitiesService } from "./services/activities.service";
import {Activity} from "./entities/activities.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Activity]),
    ],
    controllers: [ActivitiesController],
    providers: [ActivitiesService],
    exports:[ActivitiesService]
})
export class ActivitiesModule {}