import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Player} from "../players/entities/players.entity";
import { ILike, Repository } from 'typeorm';

import { Parser } from "json2csv";
import * as moment from 'moment/moment';

@Injectable()
export class CSVService {

    constructor(
        @InjectRepository(Player)
        private readonly playersRepo: Repository<Player>,
    ) {}

    dataFormat(data) {

        if (data.length === 0) {
            return []
        }
        return data.map((player: Player) => {
            try{
                return {
                    id: player.id,
                    name: player.name,
                    phoneNumber: player.phoneNumber,
                    subscription: {
                        beginDate: moment(player.subscriptions[player.subscriptions.length - 1].beginDate).format('yyyy-MM-DD'),
                        endDate: moment(player.subscriptions[player.subscriptions.length - 1].endDate).format('yyyy-MM-DD'),
                        plan: {
                            id: player.subscriptions[player.subscriptions.length - 1].plan.id,
                            name: player.subscriptions[player.subscriptions.length - 1].plan.name
                        }
                    }
                }
            }catch (e){
                console.log("PLayer missing ");
            }

        })
    }

    async getAll(limit, page) {
        limit = limit || 6
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0
        const data = await this.playersRepo.findAndCount({
            relations: ['subscriptions'],
            take: limit,
            skip: offset,
            order: {
                id: "DESC",
            }
        });
        const items = this.dataFormat(data[0])
        return {
            items: items,
            count: data[1]
        }
    }
    async searchByOption(searchElement: any, searchOption: string, limit, page/*, adminName*/) {
        limit = limit || 10
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0
        if(searchElement){
            switch (searchOption) {
                case "id": {
                    const data = await this.playersRepo.findAndCount({
                        where: {
                            id: Number(searchElement)
                        },
                        relations: ["subscriptions"],
                        take: limit,
                        skip: offset
                    })
                    return {
                        items: this.dataFormat(data[0]),
                        count: data[1]
                    }
                }
                case "name":{
                    const data = await this.playersRepo.findAndCount({
                        where :{
                            name: ILike(`${searchElement}%`)
                        },
                        relations: ["subscriptions"],
                        take: limit,
                        skip: offset
                    })
                    return {
                        items: this.dataFormat(data[0]),
                        count: data[1]
                    }
                }
                case "barCode": {
                    const data = await this.playersRepo.findAndCount({
                        where: {
                            barCode: searchElement
                        },
                        relations: ["subscriptions"],
                        take: limit,
                        skip: offset
                    })
                    return {
                        items: this.dataFormat(data[0]),
                        count: data[1]
                    }
                }
                case 'phone': {
                    const data = await this.playersRepo.findAndCount({
                        where: {
                            phoneNumber: searchElement
                        },
                        relations: ["subscriptions"],
                        take: limit,
                        skip: offset
                    })
                    const player = this.dataFormat(data[0]);
                    return {
                        items: player,
                        count: data[1]
                    }
                }
                case'beginDate':
                case 'endDate': {
                    const sql = `select p.id,
                                        p.name,
                                        p.phoneNumber,
                                        sub.beginDate,
                                        sub.endDate,
                                        sub.planId,
                                        pl.name as "planName"
                                FROM player as p
                                        INNER JOIN subscription as sub on p.id = sub.playerId
                                        inner join plan as pl on sub.planId = pl.id
                                where DATE (sub.${searchOption}) = "${searchElement}"`;
                    let count = await this.playersRepo.query(sql + ";");
                    count = count.length
                    const res = await this.playersRepo.query(sql + ` limit ${limit} offset ${offset};`), vstdPlayers = [],
                      res2 = []
                    for (let i = 0; i < res.length; i++) {

                        if (!vstdPlayers[res[i].id]) {
                            vstdPlayers[res[i].id] = true
                            res2.push({
                                id: res[i].id,
                                name: res[i].name,
                                phoneNumber: res[i].phoneNumber,
                                subscription: {
                                    beginDate: moment(res[i].beginDate).format("yyyy-MM-DD"),
                                    endDate: moment(res[i].endDate).format("yyyy-MM-DD"),
                                    plan: {
                                        id: res[i].planId,
                                        name: res[i].planName
                                    }
                                }
                            })
                        }
                    }
                    return {
                        items: res2,
                        count: count
                    }
                }
                case "plan": {
                    if (searchElement) {
                        const players = await this.playersRepo.find({
                            relations: ["subscriptions"]
                        })
                        let res = []
                        for (let i = 0; i < players.length; i++) {
                            let isInPlan = false
                            const notInPlanSubscriptionsId = []
                            for (let j = players[i].subscriptions.length - 1; j > -1; j--) {
                                if (players[i].subscriptions[j].plan.id === Number(searchElement)) {
                                    if (moment(players[i].subscriptions[j].endDate).isAfter(moment()))
                                        isInPlan = true
                                } else {
                                    notInPlanSubscriptionsId.push(j)
                                }
                            }
                            if (isInPlan) {
                                for (let j = 0; j < notInPlanSubscriptionsId.length; j++) {
                                    players[i].subscriptions.splice(notInPlanSubscriptionsId[j], 1)
                                }
                                res.push(players[i])
                            }
                        }
                        res = this.dataFormat(res)
                        const res2 = []
                        for (let i = offset, cont = 0; i < res.length; i++, cont++) {
                            if (cont === limit) break;
                            res2.push(res[i])
                        }
                        return {
                            items: res2,
                            count: res.length
                        }
                    } else {
                        return await this.getAll(limit, page)
                    }
                }
                case "ended": {
                    const players = await this.playersRepo.find({
                        relations: ["subscriptions"]
                    })
                    let res = this.dataFormat(players), res2 = []
                    for (let i = 0; i < res.length; i++) {
                        if (moment(res[i].subscription.endDate).isBefore(moment())) {
                            // this is ended subscriber player
                            res2.push(res[i])
                        }
                    }
                    res = res2
                    res2 = []
                    for (let i = offset, cont = 0; i < res.length; i++, cont++) {
                        if (cont === limit) break;
                        res2.push(res[i])
                    }
                    return {
                        items: res2,
                        count: res.length
                    }
                }
                default:
                    return await this.getAll(limit, page)
            }
        }
    }



    // this method will be called from the controller
    // simply this will return a text that will be return to the user in the response
    // but we will say in the headers of the response that this text is a content of a .csv file so the browser
    // not read it as a normal string but as a csv file then download it
    // but guys we will have an issue with electron as electron actually is a browser so when we send the response we will not know where exactly the file is saved in
    // we have a solution is when the user click the button to download a csv we open this link in a normal chrome browser
    // and this will be great
    // don't worry I will do this in the elctron code

    async forPlayers(searchElement, searchOption) {
        // back to the csv generation process
        // first we make an empty array that will hold the data that we want to export
        const records = [];
        // and create a headers array for the Excel file headers link this
        const headers = [
            {
                label: "ID",
                value: 'id'
            },
            {
                label: "Name",
                value: 'name'
            },
            {
                label: "Phone Number",
                value: 'phoneNumber'
            },
            {
                label: "plan",
                value: 'subscription.plan.name'
            },
            {
                label: "beginDate",
                value: 'subscription.beginDate'
            },
            {
                label: "endDate",
                value: 'subscription.endDate'
            },


        ];

        /*
         | ID | Name | PhoneNumber | Height | =>  header.label
         | xx | xxxx |    xxxxx    |   xx   | =>  player[value]
         */
        // NOTe that the headers value must match the property name in the data source
        // and the header label property is how it shoud be displayed in the file
        let players;
        if(searchElement && searchOption){
            players = await this.searchByOption(searchElement, searchOption, 10000, 1);
        }else{
            players = await this.getAll(1000,1);
        }

        players.items.forEach(player => {
            records.push(player)
        })
        const json2csv = new Parser({ fields: headers })
        try {

            let csvFileContent = json2csv.parse(records)
            // we get the data from the database and push it into the records array
            // console.log(csvFileContent)
            csvFileContent= '\ufeff' + csvFileContent;
            return csvFileContent;
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }
}
