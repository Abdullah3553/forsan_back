import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { logsModule } from "../logsModule/logs.module";
import { OutCome } from "./entities/outCome.entity";
import { outComeController } from "./controller/outComeController";
import { OutComeService } from "./services/outCome.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([OutCome]),
        logsModule
    ],
    controllers: [outComeController],
    providers: [OutComeService],
    exports:[OutComeService]
})
export class outComeModule {}
