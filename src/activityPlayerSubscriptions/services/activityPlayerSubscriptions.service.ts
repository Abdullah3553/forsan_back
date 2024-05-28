import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ActivityPlayerSubscription} from "../entities/activityPlayerSubscriptions.entity";
import {ActivitiesService} from "../../activities/services/activities.service";
import {ActivityPlayersService} from "../../activityPlayers/services/activityPlayers.service";
import {CreateNewActivityPlayerSubscriptionRequest} from "../requests/createNewActivityPlayerSubscription.request";
import * as moment from "moment/moment";
import {LogsService} from "../../logsModule/service/logs.service";
import * as TelegramBot from 'node-telegram-bot-api';
import { UserContextService } from "../../dataConfig/userContext/user-context.service";
@Injectable()
export class ActivityPlayerSubscriptionsService {

    constructor(
        @InjectRepository(ActivityPlayerSubscription)
        private readonly activityPlayerSubscriptionRepo: Repository<ActivityPlayerSubscription>,
        private readonly activityService: ActivitiesService,
        private readonly activityPlayerService: ActivityPlayersService,
        private readonly logsService: LogsService,
        private readonly userContextService: UserContextService
    ) {
    }

    async getSinglePlayer(limit, page ,playerId: number) {
        limit = limit || 10
        page = page || 1
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit)
        const data: any = await this.activityPlayerSubscriptionRepo.findAndCount({
            where: {
                activityPlayer: {
                    id: playerId
                }
            },
            take: limit,
            skip: offset,
        })
        return {
            items: data[0],
            count: data[1]
        }
    }

    async newSubscription(request: CreateNewActivityPlayerSubscriptionRequest) {
        const check = await this.activityPlayerSubscriptionRepo.query(`SELECT *
                                                                       FROM \`activity_player_subscription\`
                                                                       WHERE \`endDate\` >= '${request.endDate}'
                                                                         AND \`activityId\` = ${request.activity_id}
                                                                         AND \`activityPlayerId\` = ${request.player_id} ` )
        if (check && check.length) {
            throw new BadRequestException({
                message: "User already have a valid subscription In this duration"
            })
        }
        const newSub = new ActivityPlayerSubscription()
        newSub.activity = await this.activityService.doesActivityExists(request.activity_id)
        newSub.activityPlayer = await this.activityPlayerService.doesActivityPlayerExist(request.player_id)
        newSub.beginDate = request.beginDate
        newSub.endDate = request.endDate
        newSub.price = request.price
        newSub.creationDate = moment().format("yyyy-MM-DD")
        await this.activityPlayerSubscriptionRepo.save(newSub)
        return await this.activityPlayerService.getAll();
    }

    async todaySubscriptions() {
        return await this.activityPlayerSubscriptionRepo.find({
            where: {
                creationDate: moment().format("yyyy-MM-DD")
            }
        })
    }

    async updateSubDate(request, requestId: number) {
        const sub = await this.doesSubscriptionExist(requestId)
        sub.beginDate = request.beginDate
        sub.endDate = request.endDate
        return this.activityPlayerSubscriptionRepo.save(sub)
    }

    async doesSubscriptionExist(id: number) {
        const subscription = this.activityPlayerSubscriptionRepo.findOne({where: {id: id}})
        if (!subscription) {
            throw new NotFoundException("Activity Player is not subscribe.")
        }
        return subscription
    }


    async editSubscription(body, id:number) {
        const subscription = await this.doesSubscriptionExist(id)
        const oldSubscription = await this.doesSubscriptionExist(id)
        subscription.activity = body.activity
        subscription.activityPlayer = body.activityPlayer
        subscription.beginDate = body.beginDate.toString()
        subscription.endDate = body.endDate.toString()
        subscription.price = body.price
        await this.activityPlayerSubscriptionRepo.update(id, subscription)
        const updatedSubscription = await this.doesSubscriptionExist(id)
        this.editedData(oldSubscription, updatedSubscription)
        await this.logsService.createNewLog(subscription.id, `edited subscription for ${subscription.activityPlayer.name} activity player`, 'activityPlayers')
        return this.getSinglePlayer(10, 1, body.activityPlayer.id)
    }

    editedData(oldData, newData) {
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        const extractData = (data) => ({
            playerName: data.activityPlayer.name,
            activity: data.activity.name,
            beginDate: data.beginDate,
            endDate: data.endDate,
            price: data.price
        });
        const old = extractData(oldData);
        const newD = extractData(newData);
        console.log("old : ", old);
        console.log("new : ", newD);
        
        
        const changedData = [];
        for (const key in old) {
            if (old.hasOwnProperty(key) && newD.hasOwnProperty(key)) {
                if (old[key] !== newD[key]) {
                    changedData.push({ field: key, newValue: newD[key], oldValue: old[key] });
                }
            }
        }
        changedData.forEach(item => {
            bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} edited activity subscription for player: ${old.playerName} and has changed the ${item.field} from ${item.oldValue} to ${item.newValue}`);
        });
        
        return changedData;
    }

    async getDetailedIncome() {
        const allActivities = await this.activityService.getAll();
        const subsObject = [];
        
        const promises = allActivities.items.map(async (activity) => {
          const todaySubscriptions = await this.activityPlayerSubscriptionRepo.find({
            where: {
                beginDate: moment().format("yyyy-MM-DD"),
                activity: activity
            }
          });
    
          if (todaySubscriptions && todaySubscriptions.length > 0) {
            let totalMoney = 0;
            todaySubscriptions.forEach(sub => {
              totalMoney += sub.price;
            });
            subsObject.push({
              totalNumberOfSubscriptions: todaySubscriptions.length,
              activityName: activity.name,
              payedMoney: totalMoney
            });
          }
        });
    
        await Promise.all(promises);
        return subsObject;
    }

    async getTodayIncome(){
        const subs = await this.activityPlayerSubscriptionRepo.find({
            where:{
                beginDate: moment().format("yyyy-MM-DD")
            }
        })
        let totalIncome = 0;
        subs.forEach(sub => {
            totalIncome += sub.price;
        });
        return {
            totalIncome: totalIncome
        }
    }
}
