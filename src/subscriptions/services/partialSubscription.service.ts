import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Subscription} from "../entities/subscription.entity";
import {Repository} from "typeorm";
import {Player} from "../../players/entities/player.entity";


@Injectable()
export class PartialSubscriptionService {
    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionsRepo : Repository<Subscription>,
    ) {}

    // create subscriptions or renew subscriptions
    // both will add new row in the table
    async deleteAllSubscriptionsForPlayer(Player:Player){
        while(true){
            const player_sub = await this.subscriptionsRepo.findOne({where:{player:Player}})
            if(!player_sub){
                break;
            }
            await this.subscriptionsRepo.remove(player_sub)
        }
        return {message:"Subscriptions deleted..."}
    }



}
