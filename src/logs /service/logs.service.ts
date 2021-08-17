import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import * as moment from 'moment'
import { getConnection, Repository } from "typeorm";
import { Log } from "../entities/logs.entitiy";


@Injectable({ scope: Scope.REQUEST })
export class LogsService{

    constructor(
        @InjectRepository(Log)
        private readonly logRepo: Repository<Log>,
        @Inject(REQUEST)
         private request : Request,
    ){}

    async getAll(){
        return this.logRepo.find({
            where:{
                dayDate: moment().format("yyyy-MM-DD")
            }
        })
    }

   async  createNewLog(logId: number, logType: string, logSource: string) {
        const user:any = this.request.user
    
        console.log(user);
        
        const log = new Log()
        log.adminName = user.username
        log.dayDate = moment().format("YYYY-MM-DD")
        log.dayTime = moment().format("hh:mm:ss A")               
        log.logId = logId
        log.logSource = logSource
        log.logType = logType
        try {
            await this.logRepo.save(log)
            return true 
        } catch (e) {
            return false
        }
    }

    getAt(body) {
        const date = new Date(body.date)
        return this.logRepo.find({
            where: {
                dayDate: date
            }
        })
    }

}