import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import * as moment from 'moment'
import { Repository } from "typeorm";
import { Log } from "../entities/logs.entitiy";


@Injectable({ scope: Scope.REQUEST })
export class LogsService{

    constructor(
        @InjectRepository(Log)
        private readonly logRepo: Repository<Log>,
        @Inject(REQUEST)
         private request : Request,
    ){}

    getAll(){
        //console.log(this.request.user);
        return this.logRepo.find()
    }

    createNewLog(logId: number, logType: string, logSource: string) {
        //console.log(this.request);
        const log = new Log()
        // log.adminName = this.request
        log.dayDate = moment().format("YYYY-MM-DD")
        log.logId = logId
        log.logSource = logSource
        log.logType = logType
        
        this.logRepo.save(log)
    }
}