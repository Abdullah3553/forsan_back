import { IsDecimal, IsNotEmpty, IsNumber, IsString} from "class-validator"
import { IsNull } from "typeorm"

export class CreateNewPlayerRequest {
    
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    phoneNumber: string

    // @IsDecimal()
    // height: string

    // @IsString()
    // trainingPlan: string

    // @IsString()
    // dietPlan: string

    //@IsString()
    barCode: string

    //@IsString()
    photo:string

    // @IsNotEmpty()
    // plan: number
}