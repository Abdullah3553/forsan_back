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
        
        const newPlayer = new player()
        newPlayer.name = newInput.name
        newPlayer.phoneNumber = newInput.phoneNumber
        newPlayer.beginDate = newInput.beginDate
        newPlayer.endDate = newInput.endDate
        newPlayer.weight = newInput.weight
        newPlayer.height = newInput.height
        newPlayer.plan = newInput.plan
        //photo
        return this.playerRepo.save(newPlayer)
    }
}