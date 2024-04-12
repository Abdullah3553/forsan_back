import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from 'src/logsModule/service/logs.service';


@Injectable()
export class SubscriptionsService {
  constructor(
    //@InjectRepository(Subscriptions)
    //protected readonly ptSubscriptionsRepo: Repository<Subscriptions>,
    private readonly logsService: LogsService
  ) {}

}