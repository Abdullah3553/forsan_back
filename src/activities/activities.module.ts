import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ActivitiesController } from "./controller/activitiesController";
import { ActivitiesService } from "./services/activities.service";
import {Activity} from "./entities/activities.entity";
import { logsModule } from "../logsModule/logs.module";
import { UserContextModule } from "../dataConfig/userContext/user-context.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Activity]),
        logsModule,
        UserContextModule
    ],
    controllers: [ActivitiesController],
    providers: [ActivitiesService],
    exports:[ActivitiesService]
})
export class ActivitiesModule {}
