import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
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
        console.log(this.request.user);

    }

    createNewLog(id,src,type) {
        console.log(this.request);
    }
}