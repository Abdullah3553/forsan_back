import {Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNewActivityRequest } from "../requests/createNewActivity.request";
import {Activity} from "../entities/activities.entity";
import { Log } from "src/logs /entities/logs.entitiy";

@Injectable()
export class ActivitiesService {

    // Creating player's object 
    constructor(
        @InjectRepository(Activity)
        private readonly activityRepo:  Repository<Activity>,
        private readonly logReop: Repository<Log>
    ) {}

    getAll(){
        // Get all Activities from the table
        return this.activityRepo.find();
    }

    async newActivity(body : CreateNewActivityRequest){
        // here we will make the new object and add it to the database
        const activity = new Activity()
        activity.name = body.name
        activity.coachName = body.coachName
        activity.coachPhoneNumber = body.coachPhoneNumber
        activity.price = body.price
        activity.description = body.description
        const item = await this.activityRepo.save(activity)  
        return item;
    }

    async deleteActivity(activityId : number){
        // Check if the activity Exist First
        await this.doesActivityExists(activityId)
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
        return await this.activityRepo.save(search_activity)
        
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