import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubscriptionRequest {
  @IsNotEmpty()
  playerId: number;

  @IsNotEmpty()
  planId: number;

  @IsNotEmpty()
  coachId: number;

  @IsNotEmpty()
  @IsDateString()
  beginDate: string;

  @IsNotEmpty()
  @IsNumber()
  payedMoney: number;

}
