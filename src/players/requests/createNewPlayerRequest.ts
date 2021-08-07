import { IsDecimal, IsNotEmpty, IsString} from "class-validator"

export class CreateNewPlayerRequest {
    
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    phoneNumber: string

    @IsNotEmpty()
    @IsDecimal()
    height: string

    @IsNotEmpty()
    @IsString()
    trainingPlan: string

    @IsNotEmpty()
    @IsString()
    dietPlan: string

    @IsString()
    photo:string

    // @IsNotEmpty()
    // plan: number
}