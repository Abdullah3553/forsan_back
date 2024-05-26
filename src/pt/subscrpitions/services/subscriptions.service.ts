import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from '../../../logsModule/service/logs.service';
import { PtSubscription } from '../../../pt/subscrpitions/entities/subscriptions.entity'
import { CreateSubscriptionRequest } from '../requests/createSubscriptionRequest';
import { PlanService } from '../../plan/services/plan.service';
import { PlayersServices } from '../../../players/services/players.service';
import { CoachesService } from '../../../coaches/service/coaches.service';
import * as moment from 'moment';
import * as TelegramBot from 'node-telegram-bot-api';
import { UserContextService } from "../../../dataConfig/userContext/user-context.service";

@Injectable()
export class  SubscriptionsService {
  constructor(
    @InjectRepository(PtSubscription)
    protected readonly ptSubscriptionsRepo: Repository<PtSubscription>,
    private readonly logsService: LogsService,
    private readonly plansService: PlanService,
    private readonly playersService: PlayersServices,
    @Inject(forwardRef(() => CoachesService))
    private coachesService: CoachesService,
    private readonly userContextService: UserContextService
  ) {}

  async getAll(limit, page){
    limit = limit || 5
    limit = Math.abs(Number(limit));
    const offset = Math.abs((page - 1) * limit) || 0
    const subscriptions = await this.ptSubscriptionsRepo.find(
        {
          take: limit,
          skip: offset,
        }
    );    
    return {
        message: "Subscriptions fetched successfully.",
        data: subscriptions,
        count: subscriptions.length
    }
  }

  async create(requestBody: CreateSubscriptionRequest){
    const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
    
    const plan = (await this.plansService.findById(requestBody.planId)).data;
    const endDate = new Date(requestBody.beginDate);
    endDate.setDate(endDate.getDate() + Number(plan.duration)+1);
    const subscription = this.ptSubscriptionsRepo.create({
      ...requestBody,
      plan: plan,
      endDate: endDate.toISOString().split('T')[0],
      coach: (await this.coachesService.findById(requestBody.coachId)).data,
      player: (await this.playersService.findById(requestBody.playerId)).data
    });
    const newSub = await this.ptSubscriptionsRepo.save(subscription);
    await this.coachesService.updateIncome(requestBody.coachId);
    await this.logsService.createNewLog(subscription.id, `created ${subscription.id} pt subscription`, "Subscriptions");
    bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} added pt subscription for player with id ${requestBody.playerId}`);
    return {
      message: 'Subscription created successfully',
      data: newSub
    };
  }

  async update(requestBody, id){
    const subscription = await this.findById(id);
    if (!subscription.data) {
      throw new NotFoundException('Subscription not found');
    }
    const newSub = {
      beginDate: requestBody.beginDate,
      endDate: requestBody.endDate,
      payedMoney: requestBody.payedMoney,
      plan: (await this.plansService.findById(requestBody.plan)).data,
      coach: (await this.coachesService.findById(requestBody.coach)).data
    }
    await this.ptSubscriptionsRepo.update(id, newSub);

    const updatedSubscription = (await this.findById(id)).data;
    await this.coachesService.updateIncome(updatedSubscription.coach.id, subscription.data.payedMoney, subscription.data.coach.id);
    // await this.logsService.createNewLog(updatedSubscription.id, `updated ${updatedSubscription.name} Coach`, "Coaches");
    return {
      message: 'Subscription updated successfully',
      data: updatedSubscription,
    };
  }

  async delete(id){
    const subscription = (await this.findById(id)).data;
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    await this.ptSubscriptionsRepo.delete(id);
    await this.coachesService.updateIncome(subscription.coach.id);
    //await this.logsService.createNewLog(coach.id, `deleted ${coach.name} Plan`, "PT Plans");
    return {
      message: 'Subscription deleted successfully.',
      data: null,
    };
  }

  async findById(id){
    const subscription = await this.ptSubscriptionsRepo.findOne({
      where:{
        id: id
      }
    })
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return {
      message:"Subscription fetched successfully",
      data: subscription
    }
  }

  async findNotPayedForCoach(id){
    return await this.ptSubscriptionsRepo.find({
      where:{
        coach:{id: id},
        payed: "No" 
      }
    })
  }

  async findByCoachId(id, limit?, page?){
    limit = limit || 5
    limit = Math.abs(Number(limit));
    const offset = Math.abs((page - 1) * limit) || 0
    const subscriptions = await this.ptSubscriptionsRepo.findAndCount({
      where:{
        coach: { id: id }
      },
      take: limit,
      skip: offset,
      order:{
        payed:"ASC"
      }
    })
    if (!subscriptions) {
      throw new NotFoundException('Subscriptions not found');
    }
    return {
      message:"Subscriptions fetched successfully",
      data: subscriptions[0],
      count: subscriptions[1]
    }
  }

  async findByPlayerId(id, limit?, page?){
    limit = limit || 3
    limit = Math.abs(Number(limit));
    const offset = Math.abs((page - 1) * limit) || 0
    const subscriptions = await this.ptSubscriptionsRepo.findAndCount({
      where:{
        player: { id: id }
      },
      take: limit,
      skip: offset
    })
    if (!subscriptions) {
      throw new NotFoundException('Subscriptions not found');
    }
    return {
      message:"Subscriptions fetched successfully",
      items: subscriptions[0],
      count: subscriptions[1]
    }
  }
  async updatePayedState(coachId){
    return await this.ptSubscriptionsRepo.update(
        {coach:{id: coachId}},
        {payed: "Yes"}
      )
  }

  async getTodayIncome(){
    const subs = await this.ptSubscriptionsRepo.find({
        where:{
            beginDate: moment().format("yyyy-MM-DD")
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

  async getDetailedIncome() {
    const allPlans = await this.plansService.getAll();
    const subsObject = [];
    
    const promises = allPlans.data.map(async (plan) => {
      const todaySubscriptions = await this.ptSubscriptionsRepo.find({
        where: {
            beginDate: moment().format("yyyy-MM-DD"),
            plan: plan
        }
      });

      if (todaySubscriptions && todaySubscriptions.length > 0) {
        let totalMoney = 0;
        todaySubscriptions.forEach(sub => {
          totalMoney += sub.payedMoney;
        });
        subsObject.push({
          totalNumberOfSubscriptions: todaySubscriptions.length,
          planName: plan.name,
          payedMoney: totalMoney
        });
      }
    });

    await Promise.all(promises);
    return subsObject;
  }

}
