import {BadRequestException, Inject, Injectable, NotFoundException, forwardRef} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import { ILike, MoreThanOrEqual, Repository } from 'typeorm';
import {CreateNewPlayerRequest} from "../requests/createNewPlayerRequest";
import {Player} from "../entities/players.entity";
import * as moment from "moment";
import {LogsService} from "../../logsModule/service/logs.service";
import { SubscriptionsService } from "../../subscriptions/services/subscriptions.service";
import { UpdatePlayerRequest } from "../requests/updatePlayer";
import * as TelegramBot from 'node-telegram-bot-api';
import { UserContextService } from "../../dataConfig/userContext/user-context.service";

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PlayersServices {

    // Creating player's object
    constructor(
        @InjectRepository(Player)
        private readonly playersRepo: Repository<Player>,
        private readonly logsService: LogsService,
        @Inject(forwardRef(() => SubscriptionsService))
        private readonly subscriptionsService: SubscriptionsService,
        private readonly userContextService: UserContextService
    ) {
    }

    async getAll(limit, page) {
        limit = limit || 6
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0
        const data = await this.playersRepo.findAndCount({
            relations: ['subscriptions'],
            take: limit,
            skip: offset,
            order: {
                id: "DESC",
            }
        });

        const items = this.dataFormat(data[0])
        return {
            items: items,
            count: data[1]
        }
    }

    async getSignedinPlayersData(limit, page) {
        limit = limit || 10
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit)
        const SignedInData = this.logsService.getSignedIn();
        let PlayersList = [], curIndex = 0, playersCount = 0;

        for (let i = offset; i < (await SignedInData).count; i++) {
            if (playersCount === limit) break;
            const PlayerData = this.playersRepo.findOne({
                where: {id: (await SignedInData).items[i].logId},
                relations: ['subscriptions']
            });
            const LastPlayerSubscription = (await PlayerData).subscriptions.length - 1;
            if (PlayerData) {
                PlayersList[curIndex] = {
                    id: (await PlayerData).id,
                    name: (await PlayerData).name,
                    ended: this.isEndedSubscription(((await PlayerData).subscriptions[LastPlayerSubscription])),
                    phoneNumber: (await PlayerData).phoneNumber
                };
                curIndex++;
                playersCount++;
            }
        }
        const resultedObject = {
            "items": PlayersList,
            "count": (await SignedInData).count
        }
        return resultedObject;
    }

    async viewPlayer(id: number) {
        const player = await this.playersRepo.findOne({
            where: {id: id},
            relations: ['subscriptions']
        })
        if (!player) {
            throw new NotFoundException({message: "Player Not Found"})
        }
        return {
            id: player.id,
            name: player.name,
            photo: player.photo,
            height: player.height,
            phoneNumber: player.phoneNumber,
            dietPlan: player.dietPlan,
            trainingPlan: player.trainingPlan,
            barCode: player.barCode,
            subscription: {
                ...player.subscriptions[player.subscriptions.length - 1],
                beginDate: moment(player.subscriptions[player.subscriptions.length - 1].beginDate).format('yyyy-MM-DD'),
                endDate: moment(player.subscriptions[player.subscriptions.length - 1].endDate).format('yyyy-MM-DD'),
            },
            freeze: player.freeze,
            invited: player.invited
        }

    }

    async getLastSignInPlayers(limit, page, absentDays?){
        const allPlayers = await this.logsService.getLastSignInPlayers(limit, page, absentDays);
        let playersData;
        if(allPlayers[1] > 0){
            playersData = await Promise.all(                
                allPlayers[0].map(async player => {
                    return await this.viewPlayer(player.logId);
                })
            );
        }
        return {
            "data": playersData,
            "count": allPlayers[1]
        }
    }

    async getPlayersNumber() {
        //const players = await this.playersRepo.find()
        //return players.length
        const players = await this.playersRepo.find({
            relations: ["subscriptions"]
        })
        let res = this.dataFormat(players), res2 = []
        for (let i = 0; i < res.length; i++) {
            if (!(moment(res[i].subscription.endDate).isBefore(moment()))) {
                res2.push(res[i])
            }
        }
        return res2.length;
    }

    async newPlayer(newInput: CreateNewPlayerRequest): Promise<Player> {
        // if (!photo) {
        //     // Validate for photo ...
        //     throw new BadRequestException({
        //         message: "Player photo is missing"
        //     })
        // }
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        let player = new Player();
        if (!await this.doesPhoneNumberExist(newInput.phoneNumber, player.id)) {
            player.name = newInput.name
            player.photo = newInput.photo
            player.phoneNumber = newInput.phoneNumber
            player.barCode = newInput.barCode
            player.trainingPlan = newInput.trainingPlan
            player = await this.playersRepo.save(player)
            await this.logsService.createNewLog(player.id, `added ${newInput.name} player`, "players")
            bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} added ${newInput.name} player with id ${player.id}`);
            return player
        } else {
            throw new BadRequestException("Phone Number is already in use!")
        }
    }

    // delete player
    async deletePlayer(id: number) {
        const player = await this.doesPlayerExist(id) // To get the player :d

        // unlink(player.photo, (err)=>{ // delete photo of that player
        //     if(err){
        //         console.log(err)
        //         throw new BadRequestException({message:"Photo error ..."})
        //     }
        // })
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} deleted player with id ${id}`);
        await this.logsService.createNewLog(id, `deleted ${player.name} player`, "players")
        await this.subscriptionsService.deleteSubscription(id);
        
        
        await this.playersRepo.delete(id) // delete mr player him self x)
        return {
            message: 'Player has been deleted!'
        }
    }

    getIfSubChanged(changedData){
        let flag = 0;        
        changedData.forEach(item => {
            if(item === 'beginDate' || item === 'endDate' || item === 'payedMoney' || item.field === 'plan'){
                flag = 1;
            }
        });
        return flag;
    }

    async editPlayer(newInf: UpdatePlayerRequest, requestedId: number) {
        const newPlayerInfo = await this.doesPlayerExist(requestedId)
        const changedData = await this.editedData(newPlayerInfo, newInf)
        await this.subscriptionsService.getAllForPlayer(requestedId);
        await this.doesPhoneNumberExist(newInf.phoneNumber, requestedId)
        newPlayerInfo.name = newInf.name
        newPlayerInfo.phoneNumber = newInf.phoneNumber
        newPlayerInfo.barCode = newInf.barCode
        newPlayerInfo.trainingPlan = newInf.trainingPlan
        await this.logsService.createNewLog(requestedId, `edited ${newInf.name} player`, "players")
        if (newInf.photo !== null) {
            newPlayerInfo.photo = newInf.photo
        }
        const res = await this.playersRepo.save(newPlayerInfo)
        if(this.getIfSubChanged(changedData))
            await this.subscriptionsService.updateSelectedSubscriptionForPlayer(newPlayerInfo, newInf);
        const subs = res.subscriptions
        delete res.subscriptions
        return {
            ...res,
            subscription: {
                ...subs[subs.length - 1],
                beginDate: moment(subs[subs.length - 1].beginDate).format('yyyy-MM-DD'),
                endDate: moment(subs[subs.length - 1].endDate).format('yyyy-MM-DD')
            }
        }
    }

    editedData(oldData, newData) {
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        console.log(newData);
        
        const old = {
            name: oldData.name,
            barCode: oldData.barCode,
            phoneNumber: oldData.phoneNumber,
            plan: oldData.subscriptions[oldData.subscriptions.length-1].plan.id,
            beginDate: moment(oldData.subscriptions[oldData.subscriptions.length-1].beginDate).format("yyyy-MM-DD"),
            endDate: moment(oldData.subscriptions[oldData.subscriptions.length-1].endDate).format("yyyy-MM-DD"),
            payedMoney: oldData.subscriptions[oldData.subscriptions.length-1].payedMoney,
        }        
        const changedData = [];
        for (const key in old) {
            if (old.hasOwnProperty(key) && newData.hasOwnProperty(key)) {
                if (old[key] !== newData[key]) {
                    changedData.push({ field: key, newValue: newData[key], oldValue: old[key] });
                }
            }
        }
        changedData.forEach(item => {
            if(item.field !== 'beginDate' && item.field !== 'endDate' && item.field !== 'payedMoney' && item.field !== 'plan'){
                bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} edited player with id: ${oldData.id} and has changed the ${item.field} from ${item.oldValue} to ${item.newValue}`);
            }
        });
        if(newData["freezes"]){
            bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} edited player with id: ${oldData.id} and added ${newData["freezes"]} freezes days`);
        }
        if(newData["invitations"]){
            bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} edited player with id: ${oldData.id} and added ${newData["invitations"]} invitations`);
        }
        if(newData["trainingPlan"]){
            bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} edited player with id: ${oldData.id} added note : ${newData["trainingPlan"]}`);
        }
        return changedData;
    }

    async inviteFriend(requestId: number, invites: number) {
        const player = await this.doesPlayerExist(requestId)
        const subscriptions = await this.getPlayerSubscriptions(requestId)

        await this.logsService.createNewLog(requestId, `added an invitation to ${player.name} player`, "players")
        if (this.isEndedSubscription(subscriptions[subscriptions.length - 1])) {
            // validate for ended subscription
            throw new BadRequestException("This player subscription has ended")
        }

        //if(player.freeze === 0){
        // he didn't freeze before
        if (player.invited + invites <= subscriptions[subscriptions.length - 1].plan.invites) {
            player.invited += invites
            return this.playersRepo.save(player)
        }
        throw new BadRequestException("You have exeeded the limit of invites ")
        //}
        //throw new BadRequestException("You can't invite a friend because You Froze before")
    }

    async freezePlayer(requestId: number, freezeDays: number) {
        const player = await this.doesPlayerExist(requestId)
        const subscriptions = await this.getPlayerSubscriptions(requestId)

        await this.logsService.createNewLog(requestId, `freeze ${player.name} player`, "players")

        if (this.isEndedSubscription(subscriptions[subscriptions.length - 1])) {
            throw new BadRequestException("This player subscription has ended")
        }
        //if(player.invited === 0){
        // He didn't invite any Players
        if (player.freeze + freezeDays <= subscriptions[subscriptions.length - 1].plan.freezeDays) {
            // he didn't freeze before
            player.freeze += freezeDays
            return this.playersRepo.save(player)
        }
        throw new BadRequestException("You have exeeded the limit of freeze days ")
        //}
        //throw new BadRequestException("You have invited a player before so You CANNOT freeze")

    }

    async getPlayerSubscriptions(id: number) {
        const player = await this.playersRepo.findOne({
            relations: ['subscriptions'],
            where: {
                id: id
            }
        })
        if (!player) {
            if (player.subscriptions.length === 0) {
                throw new NotFoundException("Player has no subscriptions")
            }
            throw new NotFoundException("Player doesn't Exist")
        }
        return player.subscriptions
    }

    async resetFreezeAndInvites(playerId: number) {
        const player = await this.doesPlayerExist(playerId)
        player.freeze = 0
        player.invited = 0
        return this.playersRepo.save(player)
    }

    // Validation methods
    isEndedSubscription(subscription) {

        return moment(subscription.endDate).isBefore(moment())
    }

    async doesPlayerExist(id: number) {
        const player = await this.playersRepo.findOne({
            where: {id: id},
            relations: ['subscriptions']
        })
        if (!player) {
            throw new NotFoundException({message: "Player Not Found"})
        }
        return player

    }

    async doesPhoneNumberExist(phoneNumber: string, playerId: number) {
        const player = await this.playersRepo.findOne({where: {phoneNumber: phoneNumber}})
        if (player) {// we found a player with that phone number

            if (playerId) { // to make sure that player id is not null
                if (playerId == player.id) { // it means that this phone number exists but fot the player him self
                    return false
                }
                throw new BadRequestException("Phone number Exists")
            }

        }
        // phone number doesn't exist
        return false
    }

    async searchByOption(searchElement: any, searchOption: string, limit, page/*, adminName*/) {
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        limit = limit || 10
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0
        if(searchElement){
            switch (searchOption) {
                case "id": {
                    const data = await this.playersRepo.findAndCount({
                        where: {
                            id: Number(searchElement)
                        },
                        relations: ["subscriptions"],
                        take: limit,
                        skip: offset
                    })
                    return {
                        items: this.dataFormat(data[0]),
                        count: data[1]
                    }
                }
                case "name":{
                    const data = await this.playersRepo.findAndCount({
                        where :{
                            name: ILike(`${searchElement}%`)
                        },
                        relations: ["subscriptions"],
                        take: limit,
                        skip: offset
                    })
                    return {
                        items: this.dataFormat(data[0]),
                        count: data[1]
                    }
                }
                case "barCode": {
                    const data = await this.playersRepo.findAndCount({
                        where: {
                            barCode: searchElement
                        },
                        relations: ["subscriptions"],
                        take: limit,
                        skip: offset
                    })
                    if (data) {
                        const player = await this.playersRepo.findOne({
                            where: {barCode: searchElement},
                            relations: ['subscriptions']
                        })
                        /*this.userContextService.setUsername(adminName);*/
                        await this.logsService.createNewLog(player.id, `player with id: ${player.id} signed in`, "signed")
                        bot.sendMessage(process.env.Telegram_ChatId, `player ${player.name} with id: ${player.id} signed in`);
                        this.subscriptionsService.updateAttendance(player.id);
                    }
                    return {
                        items: this.dataFormat(data[0]),
                        count: data[1]
                    }
                }
                case 'phone': {
                    const data = await this.playersRepo.findAndCount({
                        where: {
                            phoneNumber: searchElement
                        },
                        relations: ["subscriptions"],
                        take: limit,
                        skip: offset
                    })
                    const player = this.dataFormat(data[0]);
                    await this.logsService.createNewLog(player.id, `player : ${player.name} signed in`, "players")
                    return {
                        items: player,
                        count: data[1]
                    }
                }
                case'beginDate':
                case 'endDate': {
                    const sql = `select p.id,
                                        p.name,
                                        p.phoneNumber,
                                        sub.beginDate,
                                        sub.endDate,
                                        sub.planId,
                                        pl.name as "planName"
                                FROM player as p
                                        INNER JOIN subscription as sub on p.id = sub.playerId
                                        inner join plan as pl on sub.planId = pl.id
                                where DATE (sub.${searchOption}) = "${searchElement}"`;
                    let count = await this.playersRepo.query(sql + ";");
                    count = count.length
                    const res = await this.playersRepo.query(sql + ` limit ${limit} offset ${offset};`), vstdPlayers = [],
                        res2 = []
                    for (let i = 0; i < res.length; i++) {

                        if (!vstdPlayers[res[i].id]) {
                            vstdPlayers[res[i].id] = true
                            res2.push({
                                id: res[i].id,
                                name: res[i].name,
                                phoneNumber: res[i].phoneNumber,
                                subscription: {
                                    beginDate: moment(res[i].beginDate).format("yyyy-MM-DD"),
                                    endDate: moment(res[i].endDate).format("yyyy-MM-DD"),
                                    plan: {
                                        id: res[i].planId,
                                        name: res[i].planName
                                    }
                                }
                            })
                        }
                    }
                    return {
                        items: res2,
                        count: count
                    }
                }
                case "plan": {
                    if (searchElement) {
                        const players = await this.playersRepo.find({
                            relations: ["subscriptions"]
                        })
                        let res = []
                        for (let i = 0; i < players.length; i++) {
                            let isInPlan = false
                            const notInPlanSubscriptionsId = []
                            for (let j = players[i].subscriptions.length - 1; j > -1; j--) {
                                if (players[i].subscriptions[j].plan.id === Number(searchElement)) {
                                    if (moment(players[i].subscriptions[j].endDate).isAfter(moment()))
                                        isInPlan = true
                                } else {
                                    notInPlanSubscriptionsId.push(j)
                                }
                            }
                            if (isInPlan) {
                                for (let j = 0; j < notInPlanSubscriptionsId.length; j++) {
                                    players[i].subscriptions.splice(notInPlanSubscriptionsId[j], 1)
                                }
                                res.push(players[i])
                            }
                        }
                        res = this.dataFormat(res)
                        const res2 = []
                        for (let i = offset, cont = 0; i < res.length; i++, cont++) {
                            if (cont === limit) break;
                            res2.push(res[i])
                        }
                        return {
                            items: res2,
                            count: res.length
                        }
                    } else {
                        return await this.getAll(limit, page)
                    }
                }
                case "ended": {
                    const players = await this.playersRepo.find({
                        relations: ["subscriptions"]
                    })
                    let res = this.dataFormat(players), res2 = []
                    for (let i = 0; i < res.length; i++) {
                        if (moment(res[i].subscription.endDate).isBefore(moment())) {
                            // this is ended subscriber player
                            res2.push(res[i])
                        }
                    }
                    res = res2
                    res2 = []
                    for (let i = offset, cont = 0; i < res.length; i++, cont++) {
                        if (cont === limit) break;
                        res2.push(res[i])
                    }
                    return {
                        items: res2,
                        count: res.length
                    }
                }
                default:
                    return await this.getAll(limit, page)
            }
        }
    }


    dataFormat(data) {

        if (data.length === 0) {
            return []
        }
        return data.map((player: Player) => {
            
            return {
                id: player.id,
                name: player.name,
                phoneNumber: player.phoneNumber,
                subscription: {
                    beginDate: moment(player.subscriptions[player.subscriptions.length - 1].beginDate).format('yyyy-MM-DD'),
                    endDate: moment(player.subscriptions[player.subscriptions.length - 1].endDate).format('yyyy-MM-DD'),
                    plan: {
                        id: player.subscriptions[player.subscriptions.length - 1].plan.id,
                        name: player.subscriptions[player.subscriptions.length - 1].plan.name
                    }
                }
            }
        })
    }


    getAllActive(limit?, page?) {
        limit = limit || 10
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0
        const data = this.playersRepo.findAndCount({
            relations: ['subscriptions'],
            take: limit,
            skip: offset,
            order: {
                subscriptions: {beginDate: "ASC"}
            },
            where: {
                subscriptions: {
                    endDate: MoreThanOrEqual(moment().format('yyyy-MM-DD'))
                }
            }
        });
        console.log(data);
        const items = this.dataFormat(data[0])
        return {
            items: items,
            count: data[1]
        }
    }

    async findById(id){
        const player = await this.playersRepo.findOne({
            where:{
                id: id
            }
        })
        if (!player) {
            throw new NotFoundException('Player Not found');
        }
        return {
            message:"Player fetched successfully",
            data: player
        }
    }
}
