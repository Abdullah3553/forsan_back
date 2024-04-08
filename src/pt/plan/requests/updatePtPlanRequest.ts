import { Optional } from "@nestjs/common";

export class UpdatePtPlanRequest {

    @Optional()
    name?: string;

    @Optional()
    sessions?: number;

    @Optional()
    price?: number;

    @Optional()
    duration?: number;
}