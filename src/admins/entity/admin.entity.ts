import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

export enum AdminRules {
    Admin= "Admin",
    SuperAdmin = "SuperAdmin"
}

@Entity({
    name: "admins"
})
export class Admin {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({
        unique: true
    })
    username: string

    @Column({
        type: "text"
    })
    password: string

    @Column({
        type:"enum",
        enum: AdminRules,
        default: AdminRules.Admin
    })
    role: AdminRules
}
