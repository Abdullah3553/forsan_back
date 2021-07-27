import { TypeOrmModule } from "@nestjs/typeorm";
import { Module} from "@nestjs/common";
import {ServiceIncome} from "./entities/servicesIncome.entity";
import {ServicesIncomeController} from "./controller/servicesIncome.controller";
import {ServicesIncomeService} from "./service/servicesIncome.service";
import {ServicessModule} from "../servicess/servicess.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([ServiceIncome]),
        ServicessModule
    ],
    controllers: [ServicesIncomeController],
    providers: [ServicesIncomeService],
    exports: [ServicesIncomeService]
})
export class ServicesIncomeModule {}