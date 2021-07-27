import { TypeOrmModule } from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import { PlayersWeightsController } from "./controller/playersWeights.controller";
import {PlayersWeightsServices} from "./services/playersWeights.service";
import {PlayerWeight} from "./entities/playersWeights.entity";
import {PlayersModule} from "../players/players.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([PlayerWeight]),
        PlayersModule
    ],
    controllers: [PlayersWeightsController],
    providers: [PlayersWeightsServices],
    exports: [PlayersWeightsServices]
})
export class PlayersWeightsModule {}

