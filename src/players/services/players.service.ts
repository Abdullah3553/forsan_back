import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { player } from "../entities/players.entity";
import { createNewPlayerRequest } from "../requests/createnewplayer.request";

@Injectable()
export class playersServices{

    // Creating player's object 
    constructor(
    @InjectRepository(player)
        private readonly playerRepo:  Repository<player>
    ) {}

    getAll(){
        // Get all players from the table 
        return this.playerRepo.find();
    }

    createNewPlayer(newInput: createNewPlayerRequest){

    }
}