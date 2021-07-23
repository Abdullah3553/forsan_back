import { TypeOrmModule } from "@nestjs/typeorm";
import { Module} from "@nestjs/common";
import {ServiceIncome} from "./entities/serviceIncome.entity";
import {ServiceIncomeController} from "./controller/serviceIncome.controller";
import {ServiceIncomeService} from "./service/serviceIncome.service";
import {ServicessModule} from "../servicess/servicess.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([ServiceIncome]),
        ServicessModule
    ],
    controllers: [ServiceIncomeController],
    providers: [ServiceIncomeService],
    exports: [ServiceIncomeService]
})
export class ServiceIncomeModule{}