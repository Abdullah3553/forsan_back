import { TypeOrmModule } from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import { PlayersWeightsController } from "./controller/playersWeights.controller";
import {PlayersWeightsServices} from "./services/playersWeights.service";
import {PlayerWeights} from "./entities/playersWeights.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([PlayerWeights]),
    ],
    controllers: [PlayersWeightsController],
    providers: [PlayersWeightsServices],
    exports: [PlayersWeightsServices]
})
export class PlayersWeightsModule {}

