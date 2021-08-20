import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {LogsService} from "src/logsModule/service/logs.service";
import {Repository} from "typeorm";
import {ActivityPlayer} from "../entities/activityPlayers.entity";
import {CreateNewActivityPlayerRequest} from "../requests/createNewActivityPlayer.request";
import {ActivityPlayerSubscription} from "../../activityPlayerSubscriptions/entities/activityPlayerSubscriptions.entity";


@Injectable()
export class ActivityPlayersService {

    constructor(
        @InjectRepository(ActivityPlayer)
        private readonly actPlayerRepo: Repository<ActivityPlayer>,
        @InjectRepository(ActivityPlayerSubscription)
        private readonly actPlayerSubsRepo: Repository<ActivityPlayerSubscription>,
        private readonly logsService: LogsService
    ) {}

    async getAll() {
        try {
            const data = await this.actPlayerRepo.find({
                relations: ['activitySubscriptions']
            })
            return data.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    phoneNumber: item.phoneNumber,
                    subscription: item.activitySubscriptions[item.activitySubscriptions.length - 1]
                }
            })
        } catch (err) {
            console.log(err)
            throw new BadRequestException("error")
        }
    }

    async newActivityPlayer(newInput: CreateNewActivityPlayerRequest) {
        const holder = await this.actPlayerRepo.findOne({where: {phoneNumber: newInput.phoneNumber}})
        if (!holder) {
            const newPlayer = new ActivityPlayer()
            newPlayer.name = newInput.name
            newPlayer.phoneNumber = newInput.phoneNumber
            const item = await this.actPlayerRepo.save(newPlayer)
            await this.logsService.createNewLog(item.id, `added ${item.name} Activityplayer`, "activity players")
            return item;
        } else
            throw new BadRequestException("PhoneNumber is already exict!");
    }

    async editActivityPlayer(newInput, reqId) {
        const newActPlayer = await this.doesActivityPlayerExist(reqId)
        newActPlayer.name = newInput.name
        newActPlayer.phoneNumber = newInput.phoneNumber
        const item = await this.actPlayerRepo.save(newActPlayer)
        const sub = await this.actPlayerSubsRepo.findOne(newInput.sub_id)
        sub.beginDate = newInput.beginDate;
        sub.endDate = newInput.endDate
        sub.activity = newInput.activity
        await this.actPlayerSubsRepo.save(sub);
        await this.logsService.createNewLog(item.id, `edited ${item.name} Activityplayer`, "activity players")
        return await this.getAll();
    }

    async deleteActivityPlayer(id: number) {
        const activityPlayer = await this.doesActivityPlayerExist(id)
        await this.logsService.createNewLog(id, `deleted ${activityPlayer.name} Activityplayer`, "activity players")
        await this.actPlayerRepo.remove(activityPlayer)
        return {
            message: "Player Deleted!"
        }
    }

    async doesActivityPlayerExist(id: number) {
        //get single player ...
        const activityPlayer = await this.actPlayerRepo.findOne({
            where: {id: id},
            relations: ['activitySubscriptions'],
        })
        if (!activityPlayer) {
            throw new NotFoundException("Player is Not Found")
        }
        return activityPlayer
    }
}
