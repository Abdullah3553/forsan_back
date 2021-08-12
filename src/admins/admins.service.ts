import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Admin} from "./entity/admin.entity";

@Injectable()
export class AdminsService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminsRepo : Repository<Admin>
    ) {}



}
