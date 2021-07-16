import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { servicessController } from "./controller/servicess.controller";
import { servicessServices } from "./services/servicess.service";
import {Service} from "./entities/servicess.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Service]),
    ],
    controllers: [servicessController],
    providers: [servicessServices]
})
export class ServicessModule {}