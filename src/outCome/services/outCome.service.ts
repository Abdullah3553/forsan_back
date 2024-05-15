import {Injectable, InternalServerErrorException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {MoreThanOrEqual, Repository} from "typeorm";
import { LogsService } from "../../logsModule/service/logs.service";
import { OutCome } from "../entities/outCome.entity";
import { CreateNewOutComeRequest } from "../requests/createNewOutcome.request";
import * as moment from "moment";


@Injectable()
export class OutComeService {

    // Creating player's object
    constructor(
        @InjectRepository(OutCome)
        private readonly outComeRepo:  Repository<OutCome>,
        private readonly logsService: LogsService
    ) {}

    getAll(){
        return this.outComeRepo.find()
    }

    async getToday(todayDate){
        const tmp = await this.outComeRepo.find({
            where:{
                creationDate : MoreThanOrEqual(todayDate)
            }
        })
        return tmp
    }

    async newOutCome(body: CreateNewOutComeRequest){
        try{
            const newOutCome = new OutCome()
            newOutCome.price = body.price
            newOutCome.description = body.description
            newOutCome.creationDate = body.dayDate

            const item = await this.outComeRepo.save(newOutCome)
            await this.logsService.createNewLog(item.id, `added ${item.description}`, "outCome")
            return item;
        } catch(err){
            console.error(err);

            throw new InternalServerErrorException({
                message: err.message
            })
        }
    }

    async deleteOutCome(outComeId : number){
        try{
            const item = await this.outComeRepo.findOne({where: {id: outComeId}})
            await this.logsService.createNewLog(outComeId, `deleted ${item.description}`, "outCome")
            await this.outComeRepo.delete(outComeId)
            return {message:"outCome deleted"}
        } catch(err){
            console.error(err);

            throw new InternalServerErrorException({
                message: err.message
            })
        }
    }

    async editOutCome(outComeId: number, body: CreateNewOutComeRequest){
        try{
            await this.logsService.createNewLog(outComeId, `edited ${body.description}`, "outCome")
            const newOutCome = await this.outComeRepo.findOne({where: {id: outComeId}})
            newOutCome.description =body.description
            newOutCome.price = body.price
            return await this.outComeRepo.save(newOutCome)
        }catch(err){
            console.error(err);

            throw new InternalServerErrorException({
                message: err.message
            })
        }
    }
}
