import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { logsModule } from "src/logsModule/logs.module";
import { ActivityPlayersController } from "./controller/activityPlayersController";
import { ActivityPlayer } from "./entities/activityPlayers.entity";
import { ActivityPlayersService } from "./services/activityPlayers.service";


@Module({

    imports: [
        TypeOrmModule.forFeature([ActivityPlayer]),
        logsModule
    ],
    controllers: [ActivityPlayersController],
    providers: [ActivityPlayersService],
    exports:[ActivityPlayersService]
})
export class ActivityPlayersModule {}
