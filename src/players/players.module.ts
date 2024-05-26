import { TypeOrmModule } from "@nestjs/typeorm";
import {forwardRef, Module} from "@nestjs/common";
import { PlayersController } from "./controller/players.controller";
import {PlayersServices} from "./services/players.service";
import {Player} from "./entities/players.entity";
import { logsModule } from "../logsModule/logs.module";
import {SubscriptionsModule} from "../subscriptions/subscriptions.module";
import { UserContextModule } from "src/dataConfig/userContext/user-context.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([Player]),
        logsModule,
        forwardRef(()=>SubscriptionsModule),
        UserContextModule
    ],
    controllers: [PlayersController],
    providers: [PlayersServices],
    exports: [PlayersServices]
})
export class PlayersModule{}
