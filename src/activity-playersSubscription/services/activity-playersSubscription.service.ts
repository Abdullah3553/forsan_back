import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {ActivityPlayerSubscription} from "../entities/activity-playersSubscription.entity";



@Injectable()
export class ActivityPlayersSubscriptionService{

    constructor(
        @InjectRepository(ActivityPlayerSubscription)
        private readonly actPlayerSubRepo: Repository<ActivityPlayerSubscription>
    ){}
}