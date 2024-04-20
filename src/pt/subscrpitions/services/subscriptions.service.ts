import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from 'src/logsModule/service/logs.service';
import { PtSubscription } from 'src/pt/subscrpitions/entities/subscriptions.entity'
import { CreateSubscriptionRequest } from '../requests/createSubscriptionRequest';
import { PlanService } from '../../plan/services/plan.service';
import { PlayersServices } from '../../../players/services/players.service';
import { CoachesService } from '../../../coaches/service/coaches.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(PtSubscription)
    protected readonly ptSubscriptionsRepo: Repository<PtSubscription>,
    private readonly logsService: LogsService,
    private readonly plansService: PlanService,
    private readonly playersService: PlayersServices,
    @Inject(forwardRef(() => CoachesService))
    private coachesService: CoachesService
  ) {}

  async getAll(){
    const subscriptions = await this.ptSubscriptionsRepo.find();    
    return {
        message: "Subscriptions fetched successfully.",
        data: subscriptions,
        count: subscriptions.length
    }
  }

  async create(requestBody: CreateSubscriptionRequest){
    const plan = (await this.plansService.findById(requestBody.planId)).data;
    const endDate = new Date(requestBody.beginDate);
    endDate.setDate(endDate.getDate() + plan.duration+1);
    const subscription = this.ptSubscriptionsRepo.create({
      ...requestBody,
      plan: plan,
      endDate: endDate.toISOString().split('T')[0],
      coach: (await this.coachesService.findById(requestBody.coachId)).data,
      player: (await this.playersService.findById(requestBody.playerId)).data
    });
    const newSub = await this.ptSubscriptionsRepo.save(subscription);
    await this.coachesService.updateIncome(requestBody.coachId);
    await this.logsService.createNewLog(subscription.id, `updated ${subscription.id} pt subscription`, "Subscriptions");
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

    if (requestBody.planId) {
      const planData = (await this.plansService.findById(requestBody.planId)).data;
      await this.ptSubscriptionsRepo.update(id, { plan: planData });
    }

    else if (requestBody.coachId) {
      const coachData = (await this.coachesService.findById(requestBody.coachId)).data;
      await this.ptSubscriptionsRepo.update(id, { coach: coachData });
    }
    else{
      await this.ptSubscriptionsRepo.update(id, requestBody);
    }
    const updatedSubscription = (await this.findById(id)).data;
    await this.coachesService.updateIncome(subscription.data.coach.id);
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

  async findByCoachId(id){
    const subscriptions = await this.ptSubscriptionsRepo.find({
      where:{
        coach: { id: id }
      }
    })
    if (!subscriptions) {
      throw new NotFoundException('Subscriptions not found');
    }
    return {
      message:"Subscriptions fetched successfully",
      data: subscriptions,
      count: subscriptions.length
    }
  }

  async updatePayedState(coachId){
    return await this.ptSubscriptionsRepo.update(
        {coach:{id: coachId}},
        {payed: 1}
      )
  }
}
