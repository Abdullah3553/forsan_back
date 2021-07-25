import { TypeOrmModule } from "@nestjs/typeorm";
import { Module} from "@nestjs/common";
import { PlanIncome } from "./entities/planIncome.entity";
import { planIncomeController } from "./controller/planIncome.controller";
import { PlanIncomeService } from "./services/plan-income.service";
import { PlansModule } from "src/plans/plans.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([PlanIncome]),
        PlansModule
    ],
    controllers: [planIncomeController],
    providers: [PlanIncomeService],
    exports: [PlanIncomeService]
})
export class PlanIncomeModule{}