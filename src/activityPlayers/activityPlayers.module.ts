import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { logsModule } from "../logsModule/logs.module";
import { ActivityPlayersController } from "./controller/activityPlayersController";
import { ActivityPlayer } from "./entities/activityPlayers.entity";
import { ActivityPlayersService } from "./services/activityPlayers.service";
import {ActivityPlayerSubscription} from "../activityPlayerSubscriptions/entities/activityPlayerSubscriptions.entity";
import { UserContextModule } from "../dataConfig/userContext/user-context.module";


@Module({

    imports: [
        TypeOrmModule.forFeature([ActivityPlayer,ActivityPlayerSubscription]),
        logsModule,
        UserContextModule
    ],
    controllers: [ActivityPlayersController],
    providers: [ActivityPlayersService],
    exports:[ActivityPlayersService]
})
export class ActivityPlayersModule {}
