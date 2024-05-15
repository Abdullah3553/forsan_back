import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Subscription} from "./entities/subscriptions.entity";
import { SubscriptionsService } from './services/subscriptions.service';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import {PlayersModule} from "../players/players.module";
import {PlansModule} from "../plans/plans.module";
import {PartialSubscriptionsService} from "./services/partialSubscriptions.service";
import { logsModule } from '../logsModule/logs.module';
import { Log } from '../logsModule/entities/logs.entitiy';

@Module({
    imports: [
        TypeOrmModule.forFeature([Subscription]),
        forwardRef(()=>Log),
        TypeOrmModule.forFeature([Log]),
        logsModule,
        forwardRef(()=>PlansModule),
        PlayersModule
    ],
    providers: [SubscriptionsService, PartialSubscriptionsService],
    controllers: [SubscriptionsController],
    exports:[PartialSubscriptionsService, SubscriptionsService]
})
export class SubscriptionsModule {}
