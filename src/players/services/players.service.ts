import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNewPlayerRequest } from "../requests/createNewPlayerRequest";
import {Player} from "../entities/players.entity";
import { unlink } from 'fs';
import * as moment from "moment";

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
            relations: ['subscriptions' ,'playerWeights']
        });
        return data.map((player: Player) => {

            return {
                id:player.id,
                name: player.name,
                photo: player.photo,
                height: player.height,
                weights: player.playerWeights,
                phoneNumber: player.phoneNumber,
                dietPlan: player.dietPlan,
                trainingPlan: player.trainingPlan,
                subscription:player.subscriptions[player.subscriptions.length-1],
                freeze:player.freeze,
                invited:player.invited
            }
        })
    }

    async newPlayer(newInput: CreateNewPlayerRequest, photo : Express.Multer.File) : Promise<Player> {
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
    async editPlayer(newInf: CreateNewPlayerRequest, requestedId:number){
        const newPlayerInfo = await this.doesPlayerExist(requestedId)
        newPlayerInfo.name = newInf.name
        newPlayerInfo.phoneNumber = newInf.phoneNumber
        newPlayerInfo.height = newInf.height
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
            throw new NotFoundException({message:"Player Not Found"})
        }
        return player

    }

    async inviteFriend(requestId:number, numberOfInvitedPLayers:number){
        const player = await this.doesPlayerExist(requestId)
        const subscriptions = await this.getPlayerSubscriptions(requestId)
        if(this.isEndedSubscription(subscriptions[subscriptions.length-1])){
            throw new BadRequestException("This player subscription has ended")
        }
        if(!player.freeze){
            // he didn't freeze before
            if(player.invited + numberOfInvitedPLayers <= subscriptions[subscriptions.length-1].plan.numberOfExceptions ){
                player.invited += numberOfInvitedPLayers
                return this.playersRepo.save(player)
            }
            throw new BadRequestException("You have used all your invitations")
        }
        throw new BadRequestException("You can't invite a friend because You Froze before")
    }

    async freezePlayer(requestId:number){
        const player = await this.doesPlayerExist(requestId)
        const subscriptions = await  this.getPlayerSubscriptions(requestId)
        if(this.isEndedSubscription(subscriptions[subscriptions.length-1])){
            throw new BadRequestException("This player subscription has ended")
        }
        if(player.invited == 0){
            // He didn't invite any Players
            if(!player.freeze){
                // he didn't freeze before
                player.freeze = true
                return this.playersRepo.save(player)
            }
            throw new BadRequestException("You have already froze this player before")
        }
        throw new BadRequestException("You have invited a player before so You CANNOT freeze")

    }
    async getPlayerSubscriptions(id:number){
        const player = await this.playersRepo.findOne({
            relations:['subscriptions'],
            where:{
                id:id
            }
        })
        if(!player){
            throw new NotFoundException("Player doesn't Exist")
        }
        return player.subscriptions
    }

    isEndedSubscription(subscription){
        return moment(subscription.endDate).isBefore(moment())
    }


    // TODO: create the service method to update the player photo
}