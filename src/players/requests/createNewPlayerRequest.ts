import { IsDecimal, IsNotEmpty, IsNumber, IsString} from "class-validator"

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

    //@IsString() // Abdullah commented this to fix the image update problem
    barCode: string

    //@IsString()
    photo:string

    // @IsNotEmpty()
    // plan: number
}