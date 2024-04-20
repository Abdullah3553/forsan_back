import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coach } from 'src/coaches/entities/coaches.entities'
import { LogsService } from "src/logsModule/service/logs.service";
import { SubscriptionsService } from 'src/pt/subscrpitions/services/subscriptions.service';
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
    
      async getAll(){
        const coaches = await this.CoachRepo.find();
        return {
            message: "Coaches fetched successfully.",
            data: coaches,
            count: coaches.length
        }
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

      async updateIncome(id){
        const subscriptions = await this.subsService.findByCoachId(id);
        const curDate = new Date();
        const modifiedCurDate =  curDate.toISOString().slice(0, 10);
        let totalIncome = 0;        
        for (const sub of subscriptions.data){
          if(sub.endDate > modifiedCurDate){
            totalIncome += sub.payedMoney;
          }
        }
        
        await this.update({ptIncome: totalIncome}, id);
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
