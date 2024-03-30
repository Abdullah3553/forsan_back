import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from '../entities/plans.entity';
import { Repository } from 'typeorm';


@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    protected readonly repository: Repository<Plan>
  ) {}


  async getAll() {
    return await this.repository.find();
  }


}
