import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coach } from 'src/coaches/entites/coaches.entity'
import { LogsService } from 'src/logsModule/service/logs.service';
import { Repository } from 'typeorm';

@Injectable()
export class CoachesService {

    constructor(
        @InjectRepository(Coach)
        protected readonly CoachRepo: Repository<Coach>,
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
        await this.logsService.createNewLog(coach.id, `deleted ${coach.name} Plan`, "PT Plans");
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
}
