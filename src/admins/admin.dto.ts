import {AdminRules} from "./entity/admin.entity";
import {IsNotEmpty, IsString} from "class-validator";

export class AdminDTO {
    @IsNotEmpty()
    name: string
    @IsNotEmpty()
    username: string
    @IsNotEmpty()
    password: string
    @IsNotEmpty()
    role: AdminRules
}
