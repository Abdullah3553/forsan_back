import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {ActivityPlayerSubscription} from "./entities/activity-playersSubscription.entity";
import {ActivityPlayersSubscriptionController} from "./controller/activity-playersSubscription.controller";
import {ActivityPlayersSubscriptionService} from "./services/activity-playersSubscription.service";

@Module({

    imports: [
        TypeOrmModule.forFeature([ActivityPlayerSubscription])
    ],
    controllers: [ActivityPlayersSubscriptionController],
    providers: [ActivityPlayersSubscriptionService],
    exports:[ActivityPlayersSubscriptionService]
})
export class ActivityPlayersSubscriptionModule {}
