import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActivityPlayerSubscriptionsModule } from "../activityPlayerSubscriptions/activityPlayerSubscriptions.module";
import { ActivitiesIncomeController } from "./controllers/activitiesIncome.controller";
import { ActivityIncome } from "./entities/activitiesIncome.entity";
import { ActivitiesIncomeService } from "./services/activitiesIncome.services";

@Module({
    imports: [
        TypeOrmModule.forFeature([ActivityIncome]),
        ActivityPlayerSubscriptionsModule
    ],
    controllers: [ActivitiesIncomeController],
    providers: [ActivitiesIncomeService],
    exports: [ActivitiesIncomeService]
})
export class ActivitiesIncomeModule{}