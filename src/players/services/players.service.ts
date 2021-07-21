import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { createNewPlayerRequest } from "../requests/createnewplayer.request";
import {Player} from "../entities/player.entity";
import { unlink } from 'fs';
import {PartialSubscriptionService} from "../../subscriptions/services/partialSubscription.service";

@Injectable()
export class PlayersServices{

    // Creating player's object 
    constructor(
        @InjectRepository(Player)
        private readonly playersRepo:  Repository<Player>,
        private readonly SubscriptionService : PartialSubscriptionService,
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
                price: player.subscriptions[player.subscriptions.length-1]?.price,
                beginDate: player.subscriptions[player.subscriptions.length-1]?.beginDate,
                endDate: player.subscriptions[player.subscriptions.length-1]?.endDate,
                plan: player.subscriptions[player.subscriptions.length-1]?.plan?.name,
                subscriptions: player.subscriptions,
            }
        })
        return newObj
    }

    async createNewPlayer(newInput: createNewPlayerRequest,photo : Express.Multer.File) : Promise<Player> {
        if (!photo) {
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
        await this.SubscriptionService.deleteAllSubscriptionsForPlayer(player) // Delete subs of that player
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
        return showPlayer;
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