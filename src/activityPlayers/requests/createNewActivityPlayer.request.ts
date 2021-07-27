import { IsNotEmpty } from "class-validator";


export class CreateNewActivityPlayerRequest {
    @IsNotEmpty()
    name: string

}