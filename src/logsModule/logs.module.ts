import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { logsController } from "./controller/logsController";
import { Log } from "./entities/logs.entitiy";
import { LogsService } from "./service/logs.service";
import { UserContextModule } from "../dataConfig/userContext/user-context.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([Log]),
        UserContextModule
    ],
    controllers: [logsController],
    providers: [LogsService],
    exports: [LogsService]
})
export class logsModule{}