import { Injectable } from '@nestjs/common';
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


  async getAll() {
    const allPlans = await this.ptPlansRepo.find();
    return {
      "message": "Plans fetched successfully.",
      "data":[
        ...allPlans
      ],
      "count":allPlans.length
    } 
  }

  async create(requestBody){
    let newPlan = new Plan();
    newPlan = requestBody;
    const registeredPlan = await this.ptPlansRepo.save(newPlan);
    await this.logsService.createNewLog(registeredPlan.id, `added ${registeredPlan.name} Plan`, "PT Plans");
    return {
      "message": "Plan created successfully.",
      "data":{
        ...registeredPlan
      }
    } 
  }

  async update(requestBody, id){    
    const plan = await this.findById(id);
    if(plan.data){
      await this.ptPlansRepo.update(id, requestBody);
      const updatedPlan = (await this.findById(id)).data;
      await this.logsService.createNewLog(updatedPlan.id, `updated ${updatedPlan.name} Plan`, "PT Plans");
      return {
        "message":"Plan updated successfully",
        "data":{
          ...updatedPlan
        }
      }
    }else{
      return {
        "message":"Plan not found",
        "data":null
      }
    }
  }

  async delete(id){
    const plan = (await this.findById(id)).data;
    if(plan){
      this.ptPlansRepo.delete(id)
      await this.logsService.createNewLog(plan.id, `deleted ${plan.name} Plan`, "PT Plans");
      return{
        "message":"Plan deleted successfully.",
        "data":{}
      }
    }else{
      return {
        "message":"Plan not found",
        "data":null
      }
    }
  }

  async findById(id){
    const plan = await this.ptPlansRepo.findOne({
      where:{
        id: id
      }
    })    
    if(plan){
      return {
        "message":"Plan fetched successfully",
        "data":{
          ...plan
        }
      }
    }else{
      return {
        "message":"Plan not found",
        "data": null
      }
    }
  }
}
