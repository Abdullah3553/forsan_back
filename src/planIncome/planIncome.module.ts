import { TypeOrmModule } from "@nestjs/typeorm";
import { Module} from "@nestjs/common";
import {ServicessModule} from "../servicess/servicess.module";
import { PlanIncome } from "./entities/planIncome.entity";
import { planIncomeController } from "./controller/planIncome.controller";
import { planIncomeService } from "./services/planIncome.service";
import { PlansService } from "src/plans/services/plans.service";
import { PlansModule } from "src/plans/plans.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([PlanIncome]),
        PlansModule
    ],
    controllers: [planIncomeController],
    providers: [planIncomeService],
    exports: [PlansService]
})
export class PlanIncomeModule{}