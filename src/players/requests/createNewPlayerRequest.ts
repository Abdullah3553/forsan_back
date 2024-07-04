import {  IsNotEmpty,  IsOptional,  IsString} from "class-validator"
export class CreateNewPlayerRequest {
    
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    phoneNumber: string

    // @IsDecimal()
    // height: string

    @IsString()
    @IsOptional()
    trainingPlan?: string

    // @IsString()
    // dietPlan: string

    //@IsString()
    barCode: string

    //@IsString()
    photo:string

    // @IsNotEmpty()
    // plan: number
}