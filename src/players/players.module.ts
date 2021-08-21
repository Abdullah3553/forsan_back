import { TypeOrmModule } from "@nestjs/typeorm";
import { Module} from "@nestjs/common";
import { PlayersController } from "./controller/players.controller";
import {PlayersServices} from "./services/players.service";
import {Player} from "./entities/players.entity";
import { logsModule } from "src/logsModule/logs.module";
import {PlayersWeightsModule} from "../playersWeights/playersWeights.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([Player]),
        logsModule,
    ],
    controllers: [PlayersController],
    providers: [PlayersServices],
    exports: [PlayersServices]
})
export class PlayersModule{}
