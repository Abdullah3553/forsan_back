import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ServicessController } from "./controller/servicessController";
import { ServicessServices } from "./services/servicess.service";
import {Service} from "./entities/servicess.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Service]),
    ],
    controllers: [ServicessController],
    providers: [ServicessServices],
    exports:[ServicessServices]
})
export class ServicessModule {}