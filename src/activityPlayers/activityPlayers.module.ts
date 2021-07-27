import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActivityPlayersController } from "./controller/activityPlayersController";
import { ActivityPlayer } from "./entities/activityPlayers.entity";
import { ActivityPlayersService } from "./services/activityPlayers.service";


@Module({

    imports: [
        TypeOrmModule.forFeature([ActivityPlayer])
    ],
    controllers: [ActivityPlayersController],
    providers: [ActivityPlayersService],
    exports:[ActivityPlayersService]
})
export class ActivityPlayersModule {}