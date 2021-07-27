import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { activityServices } from "src/activities/services/activities.service";
import { activityPlayerServices } from "src/activity-players/services/activity-player.service";
import { Repository } from "typeorm";
import {ActivityPlayerSubscription} from "../entities/activity-playersSubscription.entity";
import { addNewActPlayer } from "../requests/add-new-act-playerSubscription.request";



@Injectable()
export class ActivityPlayersSubscriptionService{
    

    constructor(
        @InjectRepository(ActivityPlayerSubscription)
        private readonly actPlayerSubRepo: Repository<ActivityPlayerSubscription>,
        private readonly actPlayersService : activityPlayerServices,
        private readonly activityService: activityServices

    ){}

    async subscribe(req: addNewActPlayer) {
        const player = await this.actPlayersService.getSinglePlayer(req.player_id);
        const activity = await this.activityService.viewById(req.activity_id);
        const sub = new ActivityPlayerSubscription()
        sub.activityPlayer = player
        sub.activity = activity
        sub.beginDate = req.beginDate
        sub.endDate = req.endDate
        sub.price = activity.price
        return await this.actPlayerSubRepo.save(sub);
    }
}