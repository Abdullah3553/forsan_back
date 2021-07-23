import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { createNewPlayerRequest } from "../requests/createnewplayer.request";
import {Player} from "../entities/player.entity";
import { unlink } from 'fs';

@Injectable()
export class PlayersServices{

    // Creating player's object 
    constructor(
        @InjectRepository(Player)
        private readonly playersRepo:  Repository<Player>
    ) {}

    async getAll() {
        // Get all players from the table 
        const data = await this.playersRepo.find({
            relations: ['subscriptions']
        });
        const newObj = data.map((player: Player) => {

            return {
                id:player.id,
                name: player.name,
                photo: player.photo,
                height: player.height,
                weight: player.weight,
                phoneNumber: player.phoneNumber,
                dietPlan: player.dietPlan,
                trainingPlan: player.trainingPlan,
                subscription:player.subscriptions[player.subscriptions.length-1]
            }
        })
        return newObj
    }

    async createNewPlayer(newInput: createNewPlayerRequest,photo : Express.Multer.File) : Promise<Player> {
        if (!photo) {
            // Validate for photo ...
            throw new BadRequestException({
                message: "Player photo is missing"
            })
        }
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
            player.dietPlan = newInput.dietPlan
            player.trainingPlan = newInput.trainingPlan
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
        /*
        To Delete A player, We need to delete all his subscriptions,
         the personal picture and
          the player data it self
          once all these things deleted, the played has been completly deleted
        */
        const player = await this.doesPlayerExist(id) // To get the player :d
        unlink(player.photo, (err)=>{ // delete photo of that player
            if(err){
                console.log(err)
                throw new BadRequestException({message:"Photo error ..."})
            }
        })

        await this.playersRepo.delete(id) // delete mr player him self x)
        return {
            message: 'Player has been deleted!'
        }
    }

    //Edit player
    async EditPlayer(newInf: createNewPlayerRequest, requestedId:number){
        const newPlayerInfo = await this.doesPlayerExist(requestedId)
        newPlayerInfo.name = newInf.name
        newPlayerInfo.phoneNumber = newInf.phoneNumber
        newPlayerInfo.height = newInf.height
        newPlayerInfo.weight = newInf.weight
        newPlayerInfo.dietPlan = newInf.dietPlan
        newPlayerInfo.trainingPlan = newInf.trainingPlan
        return await this.playersRepo.save(newPlayerInfo)
    }

    viewPlayer(requestedId: number){
        // Search by id at the database
        return this.playersRepo.findOneOrFail({
            where: {id: requestedId},
        });
    }

    async doesPlayerExist(id:number){
        const player = await this.playersRepo.findOne({where:{id:id}})
        if(!player){
            throw new NotFoundException({mesaage:"Player Not Found"})
        }
        return player

    }

    // TODO: create the service method to update the player photo
}