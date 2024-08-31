import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Subscription} from "../entities/subscriptions.entity";
import {Between, MoreThanOrEqual, Repository} from "typeorm";
import {SubscribeRequest} from "../requests/subscribe.request";
import {PlayersServices} from "../../players/services/players.service";
import {PlansService} from "../../plans/services/plans.service";
import * as moment from "moment";
import { Log } from '../../logsModule/entities/logs.entitiy';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class SubscriptionsService {
    constructor(
      @InjectRepository(Subscription)
      private readonly subscriptionsRepo : Repository<Subscription>,
      private readonly playersService : PlayersServices,
      private readonly plansService: PlansService,
      @InjectRepository(Log)
      private readonly logsRepo: Repository<Log>
    ) {}


    async updateSelectedSubscriptionForPlayer(player, requestBody){

        const currentSub = await this.subscriptionsRepo.findOne({
            where:{
                player: player,
                endDate: MoreThanOrEqual(moment().format("yyyy-MM-DD"))
            }
        })

        const oldData = {
            plan: currentSub.plan.id,
            beginDate: moment(currentSub.beginDate).format("yyyy-MM-DD"),
            endDate: moment(currentSub.endDate).format("yyyy-MM-DD"),
            payedMoney: currentSub.payedMoney
        }
        this.editedData(oldData, requestBody, player.id)
        const newSubscribedPlan = await this.plansService.getById(requestBody.plan);

        currentSub.beginDate = requestBody.beginDate;
        currentSub.endDate = requestBody.endDate;
        currentSub.plan = newSubscribedPlan;

        await this.subscriptionsRepo.update(currentSub.id, currentSub);
    }

    async editedData(oldData, newData, playerId) {
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        const changedData = [];
        for (const key in oldData) {
            if (oldData.hasOwnProperty(key) && newData.hasOwnProperty(key)) {
                if (oldData[key] !== newData[key]) {
                    if(key === 'plan'){
                        const oldPlanName = (await this.plansService.getById(oldData[key])).name
                        const newPlanName = (await this.plansService.getById(newData[key])).name
                        changedData.push({ field: key, newValue: newPlanName, oldValue: oldPlanName });
                    }else
                        changedData.push({ field: key, newValue: newData[key], oldValue: oldData[key] });
                }
            }
        }
        changedData.forEach(item => {
            bot.sendMessage(process.env.Telegram_ChatId, `subscription for player with id: ${playerId} has changed the ${item.field} from ${item.oldValue} to ${item.newValue}`);
        });
    }

    getAll(){
        return this.subscriptionsRepo.find()
    }

    async getAllToday(todayDate:string){
        const subscriptions = await this.subscriptionsRepo.find({
            where:{
                creationDate:todayDate
            }
        })
        const plans = await this.plansService.getAll()
        const indexedPlans = [];
        const res = [];
        for(let i=0;i<plans.length;i++){
            if(plans[i].isActivated){
                indexedPlans[plans[i].id] = {
                    numberOfSubscriptions:0,
                    payedMoney:0,
                    plan:plans[i]
                }
            }
        }

        for(let i=0;i<subscriptions.length;i++){
            indexedPlans[subscriptions[i].plan.id].numberOfSubscriptions++;
            indexedPlans[subscriptions[i].plan.id].payedMoney+=subscriptions[i].payedMoney;
        }
        for(let i=0;i<plans.length;i++){
            if(plans[i].isActivated && indexedPlans[plans[i].id].numberOfSubscriptions > 0)
                res.push(indexedPlans[plans[i].id])
        }
        return res

    }

    async getAllForCurrentMonth(){
        const startOfMonth = moment().startOf('month').format("YYYY-MM-DD");
        const endOfMonth = moment().endOf('month').format("YYYY-MM-DD");

        return await this.subscriptionsRepo.count({
            where: {
                beginDate: Between(startOfMonth, endOfMonth)
            }
        });
    }

    async getAllActiveCount(){
        const subscriptions = await this.subscriptionsRepo.count({
            where:{
                endDate: MoreThanOrEqual(moment().format('yyyy-MM-DD'))
            }
        });
        return {
            count: subscriptions
        }
    }

    async getAllForPlayer(playerId:number, limit?: number, page?: number){
        limit = limit || 3
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0
        const subscriptions = await this.subscriptionsRepo.findAndCount({
            where:{
                player:{
                    id:playerId
                }
            },
            order: {
                endDate: "DESC",
            },
            take:limit,
            skip:offset
        })

        if(subscriptions[0].length === 0){
            throw new BadRequestException("This player has no subscriptions")
        }
        subscriptions[0] = subscriptions[0].map(sub=>{
            return{
                ...sub,
                beginDate: moment(sub.beginDate).format('yyyy-MM-DD'),
                endDate: moment(sub.endDate).format('yyyy-MM-DD'),
            }
        })
        return {
            items: subscriptions[0],
            count: subscriptions[1]
        }
    }

    async subscribe(request: SubscribeRequest) {
        const sub = await this.subscriptionsRepo.findOne({
            where:{
                endDate: MoreThanOrEqual(moment().format("yyyy-MM-DD")),
                player: {id: request.player_id}
            }
        })
        if(!sub){
            const player = await this.playersService.resetFreezeAndInvites(request.player_id)
            player.lastSeen = moment().format("yyyy-MM-DD");
            const plan = await this.plansService.doesPlanExist(request.plan_id);
            const subscription = new Subscription();
            subscription.player = player;
            subscription.plan = plan
            subscription.beginDate = request.beginDate
            subscription.endDate = request.endDate
            subscription.payedMoney = request.payedMoney
            subscription.creationDate = request.creationDate
            return await this.subscriptionsRepo.save(subscription);
        }
        //return new BadRequestException("This player is already subscribed")
    }

    async updateDate(request , requestId:number){
        const sub = await this.doesSubscriptionExist(requestId)
        sub.beginDate = request.beginDate
        sub.endDate = request.endDate
        sub.payedMoney = request.payedMoney
        sub.plan.invites = request.invitations
        sub.plan.freezeDays = request.freezes
        const newSub = await this.subscriptionsRepo.update(sub.id, sub)
        return newSub;
    }

    async doesSubscriptionExist(id:number){
        const sub = await this.subscriptionsRepo.findOne(
          {
              where:{
                  player:{id:id}
              }
          }
        )
        if(!sub){
            throw new BadRequestException("Subscription doesn't exist")
        }
        return sub
    }

    async getTodayIncome(){
        const subs = await this.subscriptionsRepo.find({
            where:{
                beginDate: moment().format('yyyy-MM-DD')
            }
        })
        let totalIncome = 0;
        subs.forEach(sub => {
            totalIncome += sub.payedMoney;
        });
        return {
            totalIncome: totalIncome
        }
    }


    async updateAttendance(playerId){
        const playerLogs = await this.logsRepo.count({
            where:{
                logId: playerId,
                dayDate: moment().format('yyyy-MM-DD'),
                logSource: "signed"
            }
        })

        const playerSub = await this.subscriptionsRepo.findOne({
            where:{
                player:{
                    id:playerId
                },
                endDate : MoreThanOrEqual(moment().format('yyyy-MM-DD'))
            }
        })

        if(playerLogs == 1 && playerSub){
            playerSub.attendance++;
            await this.subscriptionsRepo.update(playerSub.id, playerSub);
        }
    }

    async deleteSubscription(playerId){
        const sub = await this.subscriptionsRepo.findOne({
            where:{
                player :{id: playerId}
            }
        })
        this.subscriptionsRepo.delete(sub.id)
    }
}
