import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNewActivityRequest } from "../requests/createNewActivity.request";
import {Activity} from "../entities/activities.entity";
import { LogsService } from "../../logsModule/service/logs.service";

@Injectable()
export class ActivitiesService {

    // Creating player's object
    constructor(
        @InjectRepository(Activity)
        private readonly activityRepo:  Repository<Activity>,
        private readonly logsService: LogsService
    ) {}

    async getAll(limit, page){
        limit = limit || 5
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0
        const data =  await this.activityRepo.findAndCount({
            take: limit,
            skip: offset
        });
        return {
            items: data[0],
            count: data[1]
        }
    }

    async newActivity(body : CreateNewActivityRequest){
        // here we will make the new object and add it to the database
        const data = await this.activityRepo.findOne({
            where:{coachPhoneNumber: body.coachPhoneNumber }
        })
        if(!data){
            const activity = new Activity()
            activity.name = body.name
            activity.coachName = body.coachName
            activity.coachPhoneNumber = body.coachPhoneNumber
            activity.price = body.price
            activity.description = body.description
            const item = await this.activityRepo.save(activity)
            await this.logsService.createNewLog(item.id, `added ${item.name} activity`, "activity")
            return item;
        }else{
            throw new BadRequestException("Activity is already in use!")
        }
    }

    async deleteActivity(activityId : number){
        // Check if the activity Exist First
        const item = await this.doesActivityExists(activityId)
        await this.logsService.createNewLog(activityId, `deleted ${item.name} activity`, "activity")
        // if it exists then delete it :D
        await this.activityRepo.delete(activityId)
        return{message:"Activity Deleted :d"}
    }

    async editActivity(request : CreateNewActivityRequest, requsetId:number){
        const search_activity = await this.doesActivityExists(requsetId) // search function :D
        search_activity.name = request.name
        search_activity.coachName = request.coachName
        search_activity.coachPhoneNumber = request.coachPhoneNumber
        search_activity.price = request.price
        search_activity.description = request.description
        const item = await this.activityRepo.save(search_activity)
        await this.logsService.createNewLog(requsetId, `edited ${item.name} activity`, "activity")
        return item
    }

    viewById(requestId){
        return this.doesActivityExists(requestId)
    }

     async doesActivityExists(activityId : number){
        const searched_activity = (await this.activityRepo.findOne({where:{id:activityId}}))
        if(!searched_activity){
            // if the activity doesn't exist then throw an exception
            throw new NotFoundException({message:"Activity Not Found"})
        }
        // otherwise return it
        return searched_activity
    }


}
