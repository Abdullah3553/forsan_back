import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Admin, AdminRules} from "./entity/admin.entity";
import {AdminDTO} from "./admin.dto";
import {hashSync,genSaltSync,compareSync} from 'bcrypt'

@Injectable()
export class AdminsService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminsRepo: Repository<Admin>
    ) {}

    createAdmin(admin: AdminDTO): Promise<Admin> {
        const salt = genSaltSync(5);
        admin.password = hashSync(admin.password,salt)
        return this.adminsRepo.save(admin)
    }

    async getAdminByUserAndPassword(username: string,password: string): Promise<Admin | boolean> {
        const admin = await this.adminsRepo.findOne({
            where: {
                username: username
            }
        })
        if (!admin) {
            return false;
        }
        if (compareSync(password,admin.password)) {
            return admin
        }
        return false;
    }

    async getAdminById(id: number) : Promise<Admin | boolean> {
        const admin = await this.adminsRepo.findOne(id)
        if (!admin) {
            return  false
        }
        return admin
    }

    async isSuperAdmin(id: number) {
        const user = await this.getAdminById(id);
        return typeof user !== "boolean" ? user?.role === AdminRules.SuperAdmin : false
    }

}
