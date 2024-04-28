import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from '../entities/plans.entity';
import { Repository } from 'typeorm';
import { LogsService } from 'src/logsModule/service/logs.service';


@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    protected readonly ptPlansRepo: Repository<Plan>,
    private readonly logsService: LogsService
  ) {}


  async getAll(limit, page) {
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
    let newPlan = new Plan();
    newPlan = requestBody;
    const registeredPlan = await this.ptPlansRepo.save(newPlan);
    await this.logsService.createNewLog(registeredPlan.id, `added ${registeredPlan.name} Plan`, "PT Plans");
    return {
      message: 'Plan created successfully.',
      data: registeredPlan,
    };
  }

  async update(requestBody, id){    
    const plan = await this.findById(id);
    if (!plan.data) {
      throw new NotFoundException('Plan not found');
    }
    await this.ptPlansRepo.update(id, requestBody);
    const updatedPlan = (await this.findById(id)).data;
    await this.logsService.createNewLog(updatedPlan.id, `updated ${updatedPlan.name} Plan`, "PT Plans");
    return {
      message: 'Plan updated successfully',
      data: updatedPlan,
    };
  }

  async delete(id){
    const plan = (await this.findById(id)).data;
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    this.ptPlansRepo.delete(id)
    await this.logsService.createNewLog(plan.id, `deleted ${plan.name} Plan`, "PT Plans");
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
