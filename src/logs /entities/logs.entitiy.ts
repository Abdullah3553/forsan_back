import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "logs",
})

export class Log {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    adminName: string

    @Column()
    dayDate: string

    @Column()
    dayTime: string

    @Column()
    logId: number

    @Column()
    logType: string

    @Column()
    logSource: string
    /*
        if logoSource == player ==> then logId is the playerId
        else if logoSource == activityPlayers ==> then logId is the activityPlayerId
        else if logoSource == plan ==> then logId id the planId
        else then the logId is the serviceId
    */
}