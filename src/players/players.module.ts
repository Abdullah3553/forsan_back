import { TypeOrmModule } from "@nestjs/typeorm";
import { Module} from "@nestjs/common";
import { PlayersController } from "./controller/playersController";
import {PlayersServices} from "./services/players.service";
import {MulterModule} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {Player} from "./entities/players.entity";


const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./storage')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);    //we will not face this case propaply
        const extension = file.mimetype.split('/')[1];
        cb(null, uniqueSuffix + `.${extension}`)
    }
})

@Module({
    imports: [
        TypeOrmModule.forFeature([Player]),
        MulterModule.register({
            storage: storage,
            fileFilter: function (req, file, callback) {
                const extension = file.mimetype.split('/')[1];
                const valid_ext = ['jpg','jpeg','png','bmp']
                if (valid_ext.indexOf(extension) == -1) {
                    callback(new Error('Invalid File extension'),false)
                }
                callback(null,true);
            }
        }),
    ],
    controllers: [PlayersController],
    providers: [PlayersServices],
    exports: [PlayersServices]
})
export class PlayersModule{}