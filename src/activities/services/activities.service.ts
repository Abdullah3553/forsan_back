import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNewActivityRequest } from "../requests/createNewActivity.request";
import {Activity} from "../entities/activities.entity";
import { LogsService } from "../../logsModule/service/logs.service";
import * as TelegramBot from 'node-telegram-bot-api';
import { UserContextService } from "../../dataConfig/userContext/user-context.service";
@Injectable()
export class ActivitiesService {

    // Creating player's object
    constructor(
        @InjectRepository(Activity)
        private readonly activityRepo:  Repository<Activity>,
        private readonly logsService: LogsService,
        private readonly userContextService: UserContextService
    ) {}

    async getAll(limit?, page?){
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
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
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
            bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} added ${item.name} activity`);
            await this.logsService.createNewLog(item.id, `added ${item.name} activity`, "activity")
            return item;
        }else{
            throw new BadRequestException("Activity is already in use!")
        }
    }

    async deleteActivity(activityId : number){
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        // Check if the activity Exist First
        const item = await this.doesActivityExists(activityId)
        await this.logsService.createNewLog(activityId, `deleted ${item.name} activity`, "activity")
        // if it exists then delete it :D
        await this.activityRepo.delete(activityId)
        bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} deleted ${item.name} Activity`);
        return{message:"Activity Deleted :d"}
    }

    async editActivity(request : CreateNewActivityRequest, requsetId:number){
        const search_activity = await this.doesActivityExists(requsetId) // search function :D
        const oldActivityData = await this.doesActivityExists(requsetId)
        search_activity.name = request.name
        search_activity.coachName = request.coachName
        search_activity.coachPhoneNumber = request.coachPhoneNumber
        search_activity.price = request.price
        search_activity.description = request.description
        const item = await this.activityRepo.save(search_activity)
        this.editedData(oldActivityData, item);
        await this.logsService.createNewLog(requsetId, `edited ${item.name} activity`, "activity")
        return item
    }

    editedData(oldData, newData) {
        const bot = new TelegramBot(process.env.Telegram_Bot_Token, {polling: true});
        const extractData = (data) => ({
          name: data.name,
          coachName: data.coachName,
          coachPhoneNumber: data.coachPhoneNumber,
          price: data.price,
          description: data.description
        });
        const old = extractData(oldData);
        const newD = extractData(newData);

        console.log("old : ", old);
        console.log("new : ", newD);
        
        
        const changedData = [];
        for (const key in old) {
            if (old.hasOwnProperty(key) && newD.hasOwnProperty(key)) {
                if (old[key] !== newD[key]) {
                    changedData.push({ field: key, newValue: newD[key], oldValue: old[key] });
                }
            }
        }
        changedData.forEach(item => {
          bot.sendMessage(process.env.Telegram_ChatId, `${this.userContextService.getUsername()} edited activity: ${old.name} and has changed the ${item.field} from ${item.oldValue} to ${item.newValue}`);
        });
        
        return changedData;
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
