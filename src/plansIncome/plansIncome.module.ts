import { TypeOrmModule } from "@nestjs/typeorm";
import { Module} from "@nestjs/common";
import { PlanIncome } from "./entities/plansIncome.entity";
import { PlansIncomeController } from "./controller/plansIncomeController";
import { PlansIncomeService } from "./services/plansIncome.service";
import { PlansModule } from "src/plans/plans.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([PlanIncome]),
        PlansModule
    ],
    controllers: [PlansIncomeController],
    providers: [PlansIncomeService],
    exports: [PlansIncomeService]
})
export class PlansIncomeModule {}