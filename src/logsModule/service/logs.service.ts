import {Inject, Injectable, Scope} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {InjectRepository} from "@nestjs/typeorm";
import {Request} from "express";
import * as moment from 'moment'
import {Between, In, Repository} from "typeorm";
import {Log} from "../entities/logs.entitiy";
import { UserContextService } from "../../dataConfig/userContext/user-context.service";


@Injectable({scope: Scope.REQUEST})
export class LogsService {

    constructor(
        @InjectRepository(Log)
        private readonly logRepo: Repository<Log>,
        @Inject(REQUEST)
        private request: Request,
        private readonly userContextService: UserContextService
    ) {
    }

    async getAll(limit,page) {
        limit = limit || 10
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0
        const data = await this.logRepo.findAndCount({
            where: {
                dayDate: moment().format("YYYY-MM-DD")
            },
            take: limit,
            skip: offset,
        })
        return {
            items: data[0],
            count: data[1]
        }
    }

    async getSignedIn(){
        /*limit = limit || 10
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit)*/
        const data: any = await this.logRepo.findAndCount({
            where: {
                dayDate: moment().format("yyyy-MM-DD"),
                log: "signed"
            },
            /*take: limit,
            skip: offset,*/
        })
        return {
            items: data[0],
            count: data[1]
        }
    }

    async createNewLog(logId: number, logType: string, logSource: string) {
       //const user: any = this.request.user
        const log = new Log()
        log.adminName = this.userContextService.getUsername()
        log.dayDate = moment().format("YYYY-MM-DD")
        log.dayTime = moment().format("hh:mm:ss A")
        log.logId = logId
        log.logSource = logSource
        log.log = logType
        try {
            console.log(log);
            
            await this.logRepo.save(log)
            return true
        } catch (e) {
            console.log("Error in creating new log: ", e)
            return false
        }
    }

    async getLastSignInPlayers(limit, page, absentDays?){
        limit = limit || 10
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0

        const today = new Date(moment().format("yyyy-MM-DD"))
        const date = moment(new Date(today.setDate(today.getDate() - (absentDays || 10)))).format("yyyy-MM-DD")
        
        const holder = await this.logRepo.findAndCount({
            
            where:{
                dayDate: date,
                logSource: "signed"
            },
            take: limit,
            skip: offset,
        })
        return holder;
    }

    async getAt(body,limit?,page?) {
        limit = limit || 10
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0
        const data: any = await this.logRepo.findAndCount({
            where: {
                dayDate: body.date
            },
            take: limit,
            skip: offset,
        })
        return {
            items: data[0],
            count: data[1]
        }
    }

    async deleteAll(){
        // really dangerous 
        return await this.logRepo.clear()
    }

    async deleteSelectedTime(beginDate, endDate){
        const holder = await this.logRepo.find({where: {dayDate: Between(beginDate, endDate)}, select: ["id"]})
        const Ids = []

        for(let i = 0; i < holder.length; i++){
            Ids.push(holder[i].id)
        }
        
        await this.logRepo.delete({id: In(Ids)})
        return{
            message:"Selected logs deleted !"
        }
    }
}
