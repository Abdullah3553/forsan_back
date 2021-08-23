import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Player} from "../players/entities/players.entity";
import {Repository} from "typeorm";

import { Parser } from "json2csv";
import { ActivityPlayer } from 'src/activityPlayers/entities/activityPlayers.entity';

@Injectable()
export class CSVService {

    constructor(
        @InjectRepository(Player)
        private readonly playersRepo: Repository<Player>,
    ) {}

    // this method will be called from the controller
    // simply this will return a text that will be return to the user in the response
    // but we will say in the headers of the response that this text is a content of a .csv file so the browser
    // not read it as a normal string but as a csv file then download it
    // but guys we will have an issue with electron as electron actually is a browser so when we send the response we will not know where exactly the file is saved in
    // we have a solution is when the user click the button to download a csv we open this link in a normal chrome browser
    // and this will be great
    // don't worry I will do this in the elctron code
    
    async forPlayers() {
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

        ];
        /*
         | ID | Name | PhoneNumber | Height | =>  header.label
         | xx | xxxx |    xxxxx    |   xx   | =>  player[value]
         */
        // NOTe that the headers value must match the property name in the data source
        // and the header label property is how it shoud be displayed in the file
        const players = await this.playersRepo.find()
        players.forEach(player => {
            records.push(player)
        })
        const json2csv = new Parser({ fields: headers })
        try {
            const csvFileContent = json2csv.parse(records)
            // we get the data from the database and push it into the records array
            // console.log(csvFileContent)
            return csvFileContent;
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }
}
