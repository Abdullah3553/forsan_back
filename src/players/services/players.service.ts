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
            relations: ['subscriptions']
        });
        return data.map((player: Player) => {

            return {
                id:player.id,
                name: player.name,
                phoneNumber: player.phoneNumber,
                subscription:{
                    beginDate:player.subscriptions[player.subscriptions.length-1].beginDate,
                    endDate:player.subscriptions[player.subscriptions.length-1].endDate,
                    plan:{
                        id:player.subscriptions[player.subscriptions.length-1].plan.id,
                        name:player.subscriptions[player.subscriptions.length-1].plan.name
                    }
                }
            }
        })
    }

    async viewPlayer(id:number){
        const player = await this.playersRepo.findOne({where:{id:id},
            relations: ['subscriptions' ,'playerWeights']})
        if(!player){
            throw new NotFoundException({message:"Player Not Found"})
        }
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

    }

    async getPlayersNumber(){
        const players = await this.playersRepo.find()
        return players.length
    }

    async newPlayer(newInput: CreateNewPlayerRequest) : Promise<Player> {
        // if (!photo) {
        //     // Validate for photo ...
        //     throw new BadRequestException({
        //         message: "Player photo is missing"
        //     })
        // }
        const player = new Player();
        if(!await this.doesPhoneNumberExist(newInput.phoneNumber, player.id)){
            player.name = newInput.name
            player.photo = newInput.photo
            player.phoneNumber = newInput.phoneNumber
            player.height = newInput.height
            player.dietPlan = newInput.dietPlan
            player.trainingPlan = newInput.trainingPlan
            return await this.playersRepo.save(player)
        } else {
            throw new BadRequestException("Phone Number is already in use!")
        }
    }

    // delete player
    async deletePlayer(id: number) {
        const player = await this.doesPlayerExist(id) // To get the player :d
        //TODO DELETE PHOTOOOOOOOOOOO

        // unlink(player.photo, (err)=>{ // delete photo of that player
        //     if(err){
        //         console.log(err)
        //         throw new BadRequestException({message:"Photo error ..."})
        //     }
        // })

        await this.playersRepo.delete(id) // delete mr player him self x)
        return {
            message: 'Player has been deleted!'
        }
    }

    //Edit player
    async editPlayer(newInf: CreateNewPlayerRequest, requestedId:number){
        const newPlayerInfo = await this.doesPlayerExist(requestedId)
        await this.doesPhoneNumberExist(newInf.phoneNumber, requestedId)
        newPlayerInfo.name = newInf.name
        newPlayerInfo.phoneNumber = newInf.phoneNumber
        newPlayerInfo.height = newInf.height
        newPlayerInfo.dietPlan = newInf.dietPlan
        newPlayerInfo.trainingPlan = newInf.trainingPlan
        return await this.playersRepo.save(newPlayerInfo)
    }

    async inviteFriend(requestId:number, invites:number){
        const player = await this.doesPlayerExist(requestId)
        const subscriptions = await this.getPlayerSubscriptions(requestId)
        if(this.isEndedSubscription(subscriptions[subscriptions.length-1])){
            // validate for ended subscription
            throw new BadRequestException("This player subscription has ended")
        }

        if(player.freeze === 0){
            // he didn't freeze before
            if(player.invited + invites <= subscriptions[subscriptions.length-1].plan.invites ){
                player.invited += invites
                return this.playersRepo.save(player)
            }
            throw new BadRequestException("You have exeeded the limit of invites ")
        }
        throw new BadRequestException("You can't invite a friend because You Froze before")
    }

    async freezePlayer(requestId:number, freezeDays:number){
        const player = await this.doesPlayerExist(requestId)
        const subscriptions = await this.getPlayerSubscriptions(requestId)
        if(this.isEndedSubscription(subscriptions[subscriptions.length-1])){
            throw new BadRequestException("This player subscription has ended")
        }
        if(player.invited === 0){
            // He didn't invite any Players
            if(player.freeze + freezeDays <= subscriptions[subscriptions.length-1].plan.freezeDays){
                // he didn't freeze before
                player.freeze += freezeDays
                return this.playersRepo.save(player)
            }
            throw new BadRequestException("You have exeeded the limit of freeze days ")
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
            if(player.subscriptions.length===0){
                throw new NotFoundException("Player has no subscriptions")
            }
            throw new NotFoundException("Player doesn't Exist")
        }
        return player.subscriptions
    }

    async resetFreezeAndInvites(playerId:number){
        const player = await this.doesPlayerExist(playerId)
        player.freeze = 0
        player.invited = 0
        return this.playersRepo.save(player)
    }


    // Validation methods
    isEndedSubscription(subscription){
        
            return moment(subscription.endDate).isBefore(moment())
    }
    async doesPlayerExist(id:number){
        const player = await this.playersRepo.findOne({where:{id:id},
            relations: ['subscriptions' ,'playerWeights']})
        if(!player){
            throw new NotFoundException({message:"Player Not Found"})
        }
        return player

    }

    async doesPhoneNumberExist(phoneNumber:string, playerId:number){
        const player = await this.playersRepo.findOne({where:{phoneNumber:phoneNumber}})
        if(!player){
            // that means that phone number is availbe
            return false
        }
        // here it means that phoneNumber found
        if(player.id != playerId){
            // means that the phone number is for another player
            throw new BadRequestException("This phone number is already in use")
        }
        // means that the phone number is fond but it's for the player him self
        return false
    }


    // TODO: create the service method to update the player photo
}