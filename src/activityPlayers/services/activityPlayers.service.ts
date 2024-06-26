import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {LogsService} from "../../logsModule/service/logs.service";
import {Repository} from "typeorm";
import {ActivityPlayer} from "../entities/activityPlayers.entity";
import {CreateNewActivityPlayerRequest} from "../requests/createNewActivityPlayer.request";
import {ActivityPlayerSubscription} from "../../activityPlayerSubscriptions/entities/activityPlayerSubscriptions.entity";
import * as moment from "moment";
import * as TelegramBot from 'node-telegram-bot-api';
import { UserContextService } from "../../dataConfig/userContext/user-context.service";

@Injectable()
export class ActivityPlayersService {

    constructor(
        @InjectRepository(ActivityPlayer)
        private readonly actPlayerRepo: Repository<ActivityPlayer>,
        @InjectRepository(ActivityPlayerSubscription)
        private readonly actPlayerSubsRepo: Repository<ActivityPlayerSubscription>,
        private readonly logsService: LogsService,
        private readonly userContextService: UserContextService
    ) {}


    async getAll( limit?, page?) {
        limit = limit || 10
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0
        const data: any = await this.actPlayerRepo.findAndCount({
            take: limit,
            skip: offset,
            relations:["activitySubscriptions"]
        })
        data[0] = data[0].map((player:ActivityPlayer)=>{
            return{
                id: player.id,
                name: player.name,
                phoneNumber: player.phoneNumber,
                activitySubscriptions: player.activitySubscriptions[player.activitySubscriptions.length - 1]
            }
        })
        return {
            items: data[0],
            count: data[1]
        }
    }

    async newActivityPlayer(newInput: CreateNewActivityPlayerRequest) {
        const holder = await this.actPlayerRepo.findOne({where: {phoneNumber: newInput.phoneNumber}})
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        if (!holder) {
            const newPlayer = new ActivityPlayer()
            newPlayer.name = newInput.name
            newPlayer.phoneNumber = newInput.phoneNumber
            const item = await this.actPlayerRepo.save(newPlayer)
            await this.logsService.createNewLog(item.id, `added ${item.name} Activityplayer`, "activity players")
            bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} added ${item.name} activity player`);
            return item;
        } else
            throw new BadRequestException("PhoneNumber is already exist!");
    }

    async editActivityPlayer(newInput, reqId) {
        const newActPlayer = await this.doesActivityPlayerExist(reqId)
        const oldActPlayerData = await this.doesActivityPlayerExist(reqId)
        newActPlayer.name = newInput.name
        newActPlayer.phoneNumber = newInput.phoneNumber
        const item = await this.actPlayerRepo.save(newActPlayer)
        await this.logsService.createNewLog(item.id, `edited ${item.name} Activityplayer`, "activity players")
        this.editedData(oldActPlayerData, newActPlayer)
        return await this.getAll(10, 1);
    }

    editedData(oldData, newData) {
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        const extractData = (data) => ({
          name: data.name,
          phoneNumber: data.phoneNumber
        });
        const old = extractData(oldData);
        const newD = extractData(newData);
        const changedData = [];
        for (const key in old) {
            if (old.hasOwnProperty(key) && newD.hasOwnProperty(key)) {
                if (old[key] !== newD[key]) {
                    changedData.push({ field: key, newValue: newD[key], oldValue: old[key] });
                }
            }
        }
        changedData.forEach(item => {
          bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} edited activity player: ${old.name} and has changed the ${item.field} from ${item.oldValue} to ${item.newValue}`);
        });
        
        return changedData;
    }

    async deleteActivityPlayer(id: number) {
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        const activityPlayer = await this.doesActivityPlayerExist(id)
        await this.logsService.createNewLog(id, `deleted ${activityPlayer.name} Activityplayer`, "activity players")
        await this.actPlayerRepo.remove(activityPlayer)
        bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} deleted ${activityPlayer.name} activity player`);
        return {
            message: "Player Deleted!"
        }
    }

    async doesActivityPlayerExist(id: number) {
        //get single player ...
        const activityPlayer = await this.actPlayerRepo.findOne({
            where: {id: id},
            relations: ['activitySubscriptions'],
        })
        if (!activityPlayer) {
            throw new NotFoundException("Player is Not Found")
        }
        return activityPlayer
    }

    async searchById(requestedId: number){
        try{
            // let holder = await this.actPlayerRepo.find(
            //     {relations:["activitySubscriptions"], where:{id: requestedId}}
            // )
            const activityPlayer = await this.actPlayerRepo.findOne({
                where: {id: requestedId},
                relations: ['activitySubscriptions'],
            })
            // res = holder.map(activityPlayer=> {
            //     return{
            //         id: activityPlayer.id,
            //         name: activityPlayer.name,
            //         phoneNumber: activityPlayer.phoneNumber,
            //         subscription:activityPlayer.activitySubscriptions[activityPlayer.activitySubscriptions.length-1]
            //     }
            // })
            const actSubsLength = activityPlayer.activitySubscriptions.length;
            return {
                items: [
                    {
                        activitySubscriptions: activityPlayer.activitySubscriptions[actSubsLength-1],
                        id: activityPlayer.id,
                        name: activityPlayer.name,
                        phoneNumber: activityPlayer.phoneNumber
                    }
                ],
                count: 1
            };

        } catch(err){
            console.log(err);
            throw new InternalServerErrorException(
                "There is an error while searching about the activity player by id"
            )
        }
    }

    async searchByActivity(requestedId: number, limit, page){
        try{
            limit = limit || 10
            limit = Math.abs(Number(limit));
            const offset = Math.abs((page - 1) * limit) || 0

            const holder = await this.actPlayerRepo.find({
                relations:["activitySubscriptions"]
            }), res=[]
            let res2=[]
            console.log("holder : ", holder[0].activitySubscriptions[0].activity)    ;
            
            for(let i=0;i<holder.length;i++){
                const tmpSubs=[]
                for(let j=0;j<holder[i].activitySubscriptions.length;j++){
                    if(holder[i].activitySubscriptions[j].activity.id === Number(requestedId)){
                        if(moment(holder[i].activitySubscriptions[j].endDate).isAfter(moment()))
                        tmpSubs.push(holder[i].activitySubscriptions[j])
                    }
                }
                if(tmpSubs.length!==0){
                    res.push({...holder[i],
                        activitySubscriptions:tmpSubs})
                }
            }
            for(let i=offset, cont=0;i<res.length;i++,cont++){
                if(cont === limit) break;
                res2.push(res[i])
            }
            res2 = res2.map(activityPlayer => {
                return{
                    id:activityPlayer.id,
                    name: activityPlayer.name,
                    phoneNumber: activityPlayer.phoneNumber,
                    activitySubscriptions:activityPlayer.activitySubscriptions[activityPlayer.activitySubscriptions.length-1]
                }
            })
            
            return {
                items: res2,
                count : res.length
            }

            // const sql = `select p.id,p.name, p.phoneNumber, sub.id as "subId", sub.price, sub.creationDate, sub.beginDate,sub.endDate, sub.activityId, ac.name as "activityName", ac.id as "activityId", ac.coachName, ac.coachPhoneNumber, ac.price as "activityPrice", ac.description FROM activityPlayers as p INNER JOIN activityPlayerSubscriptions as sub on p.id = sub.activityPlayerId inner join activities as ac on sub.activityId = ac.id WHERE sub.activityId = "${requestedId}" ` // and DATE(sub.endDate) >= "${moment().format("yyyy-MM-DD")}"
            // let count = await this.actPlayerRepo.query(sql+";");
            // count = count.length
            // const res2 = await this.actPlayerRepo.query(sql+` limit ${limit} offset ${offset};`)
            // let res3=[]
            // const vstdPlayers = []
            // for(let i =0;i<res2.length;i++){
            //     if(!vstdPlayers[res2[i]]){
            //         vstdPlayers[res2[i]] = true
            //         res3.push(res2[i])
            //     }else{
            //         count--
            //     }
            // }
            // res3 =  res3.map(activityPlayer=>{
            //     return{
            //         id:activityPlayer.id,
            //         name:activityPlayer.name,
            //         phoneNumber:activityPlayer.phoneNumber,
            //         subscription:{
            //             id:activityPlayer.subId,
            //             price:activityPlayer.price,
            //             beginDate:activityPlayer.beginDate,
            //             endDate:activityPlayer.endDate,
            //             creationDate:activityPlayer.creationDate,
            //             activity:{
            //                 id:activityPlayer.activityId,
            //                 name:activityPlayer.activityName,
            //                 coachName:activityPlayer.coachName,
            //                 coachPhoneNumber:activityPlayer.coachPhoneNumber,
            //                 price:activityPlayer.activityPrice,
            //                 description:activityPlayer.description
            //             }
            //         }
            //
            //     }
            // })
            //
            // return {
            //     items:res2,
            //     count:count
            // }


        }catch(err){
            console.log(err);
            throw new InternalServerErrorException(
                "There is an error while searching about the activity player by activity id"
            )
        }
    }
    
    async showEndedSubscriptions(activityId:number, limit, page){
        try{
            // limit = limit || 10
            // limit = Math.abs(Number(limit));
            // const offset = Math.abs((page - 1) * limit)
            //
            // const sql = `select p.id,p.name, p.phoneNumber, sub.id as "subId", sub.price, sub.creationDate, sub.beginDate,sub.endDate, sub.activityId, ac.name as "activityName", ac.id as "activityId", ac.coachName, ac.coachPhoneNumber, ac.price as "activityPrice", ac.description FROM activityPlayers as p INNER JOIN activityPlayerSubscriptions as sub on p.id = sub.activityPlayerId inner join activities as ac on sub.activityId = ac.id WHERE sub.activityId = "${activityId}" and DATE(sub.endDate) < "${moment().format("yyyy-MM-DD")}"`;
            // let count = await this.actPlayerRepo.query(sql+";");
            // count = count.length
            // let res2 = await this.actPlayerRepo.query(sql+` limit ${limit} offset ${offset};`)
            // res2 =  res2.map(activityPlayer=>{
            //     return{
            //         id:activityPlayer.id,
            //         name:activityPlayer.name,
            //         phoneNumber:activityPlayer.phoneNumber,
            //         subscription:{
            //             id:activityPlayer.subId,
            //             price:activityPlayer.price,
            //             beginDate:activityPlayer.beginDate,
            //             endDate:activityPlayer.endDate,
            //             creationDate:activityPlayer.creationDate,
            //             activity:{
            //                 id:activityPlayer.activityId,
            //                 name:activityPlayer.activityName,
            //                 coachName:activityPlayer.coachName,
            //                 coachPhoneNumber:activityPlayer.coachPhoneNumber,
            //                 price:activityPlayer.activityPrice,
            //                 description:activityPlayer.description
            //             }
            //         }
            //
            //     }
            // })
            //
            // return {
            //     items:res2,
            //     count:count
            // }

            limit = limit || 10
            limit = Math.abs(Number(limit));
            const offset = Math.abs((page - 1) * limit) || 0
            activityId = Number(activityId)

            const players = await this.actPlayerRepo.find(
                {relations:["activitySubscriptions"]}
            )

            const res=[]
            let res2=[]

            for(let i = 0; i < players.length; i++){
                let isEnded=-1
                // isEnded = -1 -> initial value
                // isEnded = 0 -> false -> notEnded
                // isEnded = 1 -> true -> Ended
                const deleteActivitySubs = []
                for(let j = 0; j < players[i].activitySubscriptions.length; j++){

                    if(players[i].activitySubscriptions[j].activity.id === activityId){
                        if(!this.isEndedSubscription(players[i].activitySubscriptions[j].endDate)){
                            isEnded = 0
                            break;
                        }else{
                            isEnded = 1
                        }
                    }else {
                        deleteActivitySubs.push(j)
                    }
                }
                for(let j = deleteActivitySubs.length-1; j >= 0 ; j--){
                    players[i].activitySubscriptions.splice(deleteActivitySubs[j],1)
                }

                
                if(isEnded===1){
                    res.push(players[i])
                }
            }
            console.log("res : ", res);
            
            for(let i=offset, cont=0;i<res.length;i++,cont++){
                if(cont === limit) break;
                res2.push(res[i])
            }

            res2 = res2.map(activityPlayer => {
                return{
                    id:activityPlayer.id,
                    name: activityPlayer.name,
                    phoneNumber: activityPlayer.phoneNumber,
                    activitySubscriptions:activityPlayer.activitySubscriptions[activityPlayer.activitySubscriptions.length-1]
                }
            })
            return {
                items:res2,
                count:res.length
            }
        }catch(err){
            console.log(err);
            throw new InternalServerErrorException(
                "There is an error while searching about the ended subscriptions"
            )
        }
    }

    private isEndedSubscription(endDate) {
        return moment(endDate).isBefore(moment());
    }
}
