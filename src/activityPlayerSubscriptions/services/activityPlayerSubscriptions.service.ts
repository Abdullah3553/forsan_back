import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {MoreThan, Repository} from "typeorm";
import {ActivityPlayerSubscription} from "../entities/activityPlayerSubscriptions.entity";
import {ActivitiesService} from "../../activities/services/activities.service";
import {ActivityPlayersService} from "../../activityPlayers/services/activityPlayers.service";
import {CreateNewActivityPlayerSubscriptionRequest} from "../requests/createNewActivityPlayerSubscription.request";
import * as moment from "moment/moment";
import {ActivityPlayer} from "../../activityPlayers/entities/activityPlayers.entity";
import {LogsService} from "../../logsModule/service/logs.service";
import {of} from "rxjs";


@Injectable()
export class ActivityPlayerSubscriptionsService {

    constructor(
        @InjectRepository(ActivityPlayerSubscription)
        private readonly activityPlayerSubscriptionRepo: Repository<ActivityPlayerSubscription>,
        private readonly activityService: ActivitiesService,
        private readonly activityPlayerService: ActivityPlayersService,
        private readonly logsService: LogsService,
    ) {
    }

    /*

   findAndCount({
            where: {
                activityPlayer: {
                    id: playerId
                }
            },
            take: limit,
            skip: offset,
        })
        query(`
            SELECT * FROM \`activityPlayerSubscriptions\` WHERE \`activityPlayerId\` = ${playerId} LIMIT ${limit} OFFSET ${offset}
        `)
     */

    async getSinglePlayer(limit, page ,playerId: number) {
        limit = limit || 10
        page = page || 1
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit)
        const data: any = await this.activityPlayerSubscriptionRepo.findAndCount({
            where: {
                activityPlayer: {
                    id: playerId
                }
            },
            take: limit,
            skip: offset,
        })
        console.log(data)
        return {
            items: data[0],
            count: data[1]
        }
    }

    // async getAll() {
    // }


    async newSubscription(request: CreateNewActivityPlayerSubscriptionRequest) {
        const check = await this.activityPlayerSubscriptionRepo.query(`SELECT *
                                                                       FROM \`activityPlayerSubscriptions\`
                                                                       WHERE \`endDate\` >= '${request.endDate}'
                                                                         AND \`activityId\` = ${request.activity_id}
                                                                         AND \`activityPlayerId\` = ${request.player_id} ` )
        if (check && check.length) {
            throw new BadRequestException({
                message: "User already have a valid subscription In this duration"
            })
        }
        const newSub = new ActivityPlayerSubscription()
        newSub.activity = await this.activityService.doesActivityExists(request.activity_id)
        newSub.activityPlayer = await this.activityPlayerService.doesActivityPlayerExist(request.player_id)
        newSub.beginDate = request.beginDate
        newSub.endDate = request.endDate
        newSub.price = request.price
        newSub.creationDate = moment().format("yyyy-MM-DD")
        await this.activityPlayerSubscriptionRepo.save(newSub)
        return await this.activityPlayerService.getAll();
    }

    async todaySubscriptions() {
        return await this.activityPlayerSubscriptionRepo.find({
            where: {
                creationDate: moment().format("yyyy-MM-DD")
            }
        })
    }

    async updateSubDate(request, requestId: number) {
        const sub = await this.doesSubscriptionExist(requestId)
        sub.beginDate = request.beginDate
        sub.endDate = request.endDate
        return this.activityPlayerSubscriptionRepo.save(sub)
    }

    async doesSubscriptionExist(id: number) {
        const subscription = this.activityPlayerSubscriptionRepo.findOne({where: {id: id}})
        if (!subscription) {
            throw new NotFoundException("Activity Player is not subscribe.")
        }
        return subscription
    }


    async editSubscription(body, id:number) {
        const subscription = await this.doesSubscriptionExist(id)
        subscription.activity = body.activity
        subscription.activityPlayer = body.activityPlayer
        subscription.beginDate = body.beginDate.toString()
        subscription.endDate = body.endDate.toString()
        subscription.price = body.price
        await this.activityPlayerSubscriptionRepo.save(subscription)
        await this.logsService.createNewLog(subscription.id, `edited subscription for ${subscription.activityPlayer.name} activity player`, 'activityPlayers')
        return this.getSinglePlayer(10, 1, body.activityPlayer.id)
    }
}
