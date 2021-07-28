import {Column, Entity,ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Player} from "../../players/entities/players.entity";

@Entity({
    name: "playersWeights",
})

export class PlayerWeight {
    @PrimaryGeneratedColumn()
    id: number

    @Column('date')
    date:Date

    @Column('double')
    weight:string

    @ManyToOne(()=>Player, player=>player.id, {
        eager : true,
        onDelete : "CASCADE",
        onUpdate : "CASCADE"
    })
    player:Player
}
