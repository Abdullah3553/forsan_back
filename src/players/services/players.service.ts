import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { createNewPlayerRequest } from "../requests/createnewplayer.request";
import {Player} from "../entities/player.entity";

@Injectable()
export class playersServices{

    // Creating player's object 
    constructor(
        @InjectRepository(Player)
        private readonly playersRepo:  Repository<Player>
    ) {}

    getAll(){
        // Get all players from the table 
        // return this.playersRepo.find({
        //     relations: ['subscriptions']
        // });
        return this.playersRepo.find()
    }

    // think of a better way to handle the validation of the existence of the phone number
    // and if it's found return a Bad Request and also remove the photo manually
    async createNewPlayer(newInput: createNewPlayerRequest,photo : Express.Multer.File){
        const player = new Player();
        player.name = newInput.name
        player.photo = photo.path
        player.phoneNumber = newInput.phoneNumber
        player.height = newInput.height
        player.weight = newInput.weight
        try {
            return await this.playersRepo.save(player);
        } catch (e) {
            console.log('error while saving the player')
            console.log('but look the photo has been uploaded')
            // so we will remove it by our self
            // TODO
            // throw BadRequest Exception telling the user he has enter invalid data
        }
    }

    // delete player
    async deletePlayer(id: number){
        await this.playersRepo.delete(id);
        return {
            message: 'Player has been deleted!'
        }
    }
    //Edit player
    async EditPlayer(newInf: createNewPlayerRequest, photo: Express.Multer.File, requestedId:number){

        const newPlayerInfo = await this.playersRepo.findOneOrFail({where: {id: requestedId}})
        newPlayerInfo.name = newInf.name
        newPlayerInfo.phoneNumber = newInf.phoneNumber
        newPlayerInfo.height = newInf.height
        newPlayerInfo.weight = newInf.weight
        newPlayerInfo.photo = photo.path
        this.playersRepo.save(newPlayerInfo)
    }

    async viewPlayer(requestedId: number){
        // Search by id at the database
        const showPlayer = await this.playersRepo.findOneOrFail({where: {id: requestedId}})
        return(showPlayer) 
    }


}