import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from '../entities/plans.entity';
import { Repository } from 'typeorm';
import { LogsService } from '../../../logsModule/service/logs.service';
import * as TelegramBot from 'node-telegram-bot-api';
import { UserContextService } from "../../../dataConfig/userContext/user-context.service";

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    protected readonly ptPlansRepo: Repository<Plan>,
    private readonly logsService: LogsService,
    private readonly userContextService: UserContextService
  ) {}


  async getAll(limit?, page?) {
    limit = limit || 5
    limit = Math.abs(Number(limit));
    const offset = Math.abs((page - 1) * limit) || 0

    const allPlans = await this.ptPlansRepo.find(
      {
        take: limit,
        skip: offset,
      }
    );
    return {
      message: 'Plans fetched successfully.',
      data: allPlans,
      count: allPlans.length,
    };
  }

  async create(requestBody){
    const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
    let newPlan = new Plan();
    newPlan = requestBody;
    const registeredPlan = await this.ptPlansRepo.save(newPlan);
    await this.logsService.createNewLog(registeredPlan.id, `added ${registeredPlan.name} Plan`, "PT Plans");
    bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} added ${registeredPlan.name} Plan`);
    return {
      message: 'Plan created successfully.',
      data: registeredPlan,
    };
  }

  async update(requestBody, id){
    const olePlan = (await this.findById(id)).data;
    if (!olePlan) {
      throw new NotFoundException('Plan not found');
    }
    await this.ptPlansRepo.update(id, requestBody);
    const updatedPlan = (await this.findById(id)).data;
    this.editedData(olePlan, updatedPlan)
    await this.logsService.createNewLog(updatedPlan.id, `updated ${updatedPlan.name} Plan`, "PT Plans");
    return {
      message: 'Plan updated successfully',
      data: updatedPlan,
    };
  }

  editedData(oldData, newData) {    
    const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
    const extractData = (data) => ({
      name: data.name,
      sessions: data.sessions,
      price: data.price,
      duration: data.duration
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
      bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} edited PT plan: ${old.name} and has changed the ${item.field} from ${item.oldValue} to ${item.newValue}`);
    });
    
    return changedData;
  }

  async delete(id){
    const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
    const plan = (await this.findById(id)).data;
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    this.ptPlansRepo.delete(id)
    await this.logsService.createNewLog(plan.id, `deleted ${plan.name} Plan`, "PT Plans");
    bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} deleted ${plan.name} Plan`);
    return {
      message: 'Plan deleted successfully.',
      data: null,
    };
  }

  async findById(id){
    const plan = await this.ptPlansRepo.findOne({
      where:{
        id: id
      }
    })    
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return {
      message:"Plan fetched successfully",
      data: plan
    }
  }
}
