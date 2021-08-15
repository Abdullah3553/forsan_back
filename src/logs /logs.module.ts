import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { logsController } from "./controller/logsController";
import { Log } from "./entities/logs.entitiy";
import { LogsService } from "./service/logs.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([Log]),
    ],
    controllers: [logsController],
    providers: [LogsService],
    exports: [LogsService]
})
export class logsModule{}