import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { playersController } from "./controller/players.controller";
import { player } from "./entities/players.entity";
import { playersServices } from "./services/players.service";


@Module({
    imports: [TypeOrmModule.forFeature([player])],
    controllers: [playersController], 
    providers: [playersServices]
})
export class playersModule{}