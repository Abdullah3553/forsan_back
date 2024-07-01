import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coach } from '../../coaches/entities/coaches.entities'
import { LogsService } from "../../logsModule/service/logs.service";
import { SubscriptionsService } from '../../pt/subscrpitions/services/subscriptions.service';
import { Repository } from 'typeorm';

@Injectable()
export class CoachesService {

    constructor(
        @InjectRepository(Coach)
        protected readonly CoachRepo: Repository<Coach>,
        @Inject(forwardRef(() => SubscriptionsService))
        private subsService: SubscriptionsService,
        private readonly logsService: LogsService
      ) {}
    
      async getAll(limit?, page?){
        limit = limit || 5
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0
        const coaches = await this.CoachRepo.findAndCount({
          take: limit,
          skip: offset,
        });
        return {
            message: "Coaches fetched successfully.",
            data: coaches[0],
            count: coaches[1]
        }
      }

      async getAllCoachesCount(){
        return await this.CoachRepo.count();
      }

      async create(requestBody){
        let newCoach = new Coach();
        newCoach = requestBody;
        const registeredCoach = await this.CoachRepo.save(newCoach);
        await this.logsService.createNewLog(registeredCoach.id, `added ${registeredCoach.name} Coach`, "Coaches");
        return {
          message: 'Coach created successfully.',
          data: registeredCoach,
        };
      }
    
      async update(requestBody, id){    
        const coach = await this.findById(id);
        if (!coach.data) {
          throw new NotFoundException('Coach not found');
        }
        await this.CoachRepo.update(id, requestBody);
        const updatedCoach = (await this.findById(id)).data;
        await this.logsService.createNewLog(updatedCoach.id, `updated ${updatedCoach.name} Coach`, "Coaches");
        return {
          message: 'Coach updated successfully',
          data: updatedCoach,
        };
      }
    
      async delete(id){
        const coach = (await this.findById(id)).data;
        if (!coach) {
          throw new NotFoundException('Coach not found');
        }
        this.CoachRepo.delete(id)
        await this.logsService.createNewLog(coach.id, `deleted ${coach.name} Coach`, "Coachs");
        return {
          message: 'Coach deleted successfully.',
          data: null,
        };
      }
    
      async findById(id){
        const coach = await this.CoachRepo.findOne({
          where:{
            id: id
          }
        })    
        if (!coach) {
          throw new NotFoundException('Coach not found');
        }
        return {
          message:"Coach fetched successfully",
          data: coach
        }
      }

      async updateIncome(newCoachId, oldPayed?, oldCoachId?){
        if(oldCoachId){
          const subscriptionsForOldCoach = await this.subsService.findNotPayedForCoach(oldCoachId);
          const totalIncomeOld = this.calculateTotalIncome(subscriptionsForOldCoach);
          await this.update({ptIncome: totalIncomeOld}, oldCoachId);
        }
        const subscriptionsForNewCoach = await this.subsService.findNotPayedForCoach(newCoachId);
        const totalIncomeNew = this.calculateTotalIncome(subscriptionsForNewCoach);
        await this.update({ptIncome: totalIncomeNew}, newCoachId);
      }

      calculateTotalIncome(subscriptions){
        let totalIncome = 0;      
        for (const sub of subscriptions){
          if(sub.payed === "No"){
            totalIncome += sub.payedMoney;
          }
        }
        return totalIncome;
      }
      async resetIncome(id){
        await this.update({ptIncome: 0}, id);
        await this.subsService.updatePayedState(id);
        return {
          message: "Payed reset successfully.",
          data: null
        }
      }
}
