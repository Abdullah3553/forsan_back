import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { createNewPlayerRequest } from "../requests/createnewplayer.request";
import {Player} from "../entities/player.entity";
import { unlink } from 'fs';

@Injectable()
export class playersServices{

    // Creating player's object 
    constructor(
        @InjectRepository(Player)
        private readonly playersRepo:  Repository<Player>
    ) {}

    getAll(){
        // Get all players from the table 
        return this.playersRepo.find({
            relations: ['subscriptions']
        });
    }

    async createNewPlayer(newInput: createNewPlayerRequest,photo : Express.Multer.File) : Promise<Player> {
        const player = new Player();
        const result = await this.playersRepo.findOne(
            {
                where:{phoneNumber: newInput.phoneNumber}
            }
        )
        if(!result){
            player.name = newInput.name
            player.photo = photo.path
            player.phoneNumber = newInput.phoneNumber
            player.height = newInput.height
            player.weight = newInput.weight
            return await this.playersRepo.save(player)
        } else {
            unlink(photo.path, (err) => {
                if (err)
                    console.log(err)
            });
            throw new BadRequestException("PhoneNumber is already in use!")
        }
    }

    // delete player
    async deletePlayer(id: number) {
        await this.playersRepo.delete(id);
        return {
            message: 'Player has been deleted!'
        }
    }

    //Edit player
    async EditPlayer(newInf: createNewPlayerRequest, requestedId:number){
        const newPlayerInfo = await this.playersRepo.findOneOrFail({where: {id: requestedId}})
        newPlayerInfo.name = newInf.name
        newPlayerInfo.phoneNumber = newInf.phoneNumber
        newPlayerInfo.height = newInf.height
        newPlayerInfo.weight = newInf.weight
        return await this.playersRepo.save(newPlayerInfo)
    }

    async viewPlayer(requestedId: number){
        // Search by id at the database
        const showPlayer = await this.playersRepo.findOneOrFail({
            where: {id: requestedId},
            relations: ['subscriptions']
        })
        return(showPlayer) 
    }


    // TODO: create the service method to update the player photo

}