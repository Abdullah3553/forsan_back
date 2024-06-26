import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ServicessController } from "./controller/servicessController";
import { ServicessServices } from "./services/servicess.service";
import {Service} from "./entities/servicess.entity";
import { logsModule } from "../logsModule/logs.module";
import { UserContextModule } from "../dataConfig/userContext/user-context.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Service]),
        logsModule,
        UserContextModule
    ],
    controllers: [ServicessController],
    providers: [ServicessServices],
    exports:[ServicessServices]
})
export class ServicessModule {}
