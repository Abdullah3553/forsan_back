import { TypeOrmModule } from "@nestjs/typeorm";
import { Module} from "@nestjs/common";

import {ServiceIncome} from "./entities/services_income.entity";
import {Services_incomeController} from "./controller/services_income.controller";
import {services_incomeService} from "./service/service_income.service";
import {ServicessModule} from "../servicess/servicess.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([ServiceIncome]),
        ServicessModule
    ],
    controllers: [Services_incomeController],
    providers: [services_incomeService],
    exports: [services_incomeService]
})
export class ServiceIncomeModule{}