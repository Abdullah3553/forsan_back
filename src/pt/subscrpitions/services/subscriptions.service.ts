import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from 'src/logsModule/service/logs.service';
import { Pt_Subscription } from 'src/pt/subscrpitions/entities/subscriptions.entity'

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Pt_Subscription)
    protected readonly ptSubscriptionsRepo: Repository<Pt_Subscription>,
    private readonly logsService: LogsService
  ) {}
  
  async getAll(){
    const subscriptions = await this.ptSubscriptionsRepo.find();
    return {
        message: "Subscriptions fetched successfully.",
        data: subscriptions,
        count: subscriptions.length
    }
  }

  async create(requestBody){
    let newSubscription = new Pt_Subscription();
    newSubscription = requestBody;
    const registeredSubscription = await this.ptSubscriptionsRepo.save(newSubscription);
    // await this.logsService.createNewLog(registeredSubscription.id, `added ${registeredSubscription.name} subscription`, "Coaches");
    return {
      message: 'Subscription created successfully.',
      data: registeredSubscription,
    };
  }

  async update(requestBody, id){    
    const subscription = await this.findById(id);
    if (!subscription.data) {
      throw new NotFoundException('Subscription not found');
    }
    await this.ptSubscriptionsRepo.update(id, requestBody);
    const updatedSubscription = (await this.findById(id)).data;
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
    this.ptSubscriptionsRepo.delete(id)
    // await this.logsService.createNewLog(coach.id, `deleted ${coach.name} Plan`, "PT Plans");
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
}