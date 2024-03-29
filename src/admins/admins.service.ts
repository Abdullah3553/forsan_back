import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
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
        const admin = await this.adminsRepo.findOneById(id)
        if (!admin) {
            return  false
        }
        return admin
    }

    async isSuperAdmin(id: number) {
        const user = await this.getAdminById(id);
        return typeof user !== "boolean" ? user?.role === AdminRules.SuperAdmin : false
    }

    async getAll(limit, page){
        limit = limit || 5
        limit = Math.abs(Number(limit));
        const offset = Math.abs((page - 1) * limit) || 0

        const admins = await this.adminsRepo.findAndCount({
            take: limit,
            skip: offset,
        })
        //const _admins=[]
        // for(let i=0; i<admins.length;i++){
        //     _admins.push({
        //         id:admins[0].id,
        //         name:admins[i].name,
        //         username: admins[i].username,
        //         role: admins[i].role,
        //         index: i
        //     })
        // }
        return {
            items: admins[0],
            count: admins[1]
        }
    }

    async editAdmin(newAdmin:Admin, adminId:number){    

        const admin = await this.getAdminById(adminId)
        const _admin = admin instanceof Admin ? admin : null;
        if(!_admin){
            throw new NotFoundException("Admin not found")
        }
        _admin.name = newAdmin.name
        _admin.username = newAdmin.username
        _admin.role = newAdmin.role
        if(newAdmin.password){
            const salt = genSaltSync(5);
            _admin.password = hashSync(newAdmin.password, salt)
        }
        return await this.adminsRepo.update(_admin.id, _admin)
    }

    async deleteAdmin(adminId){
        const _admin = await this.getAdminById(adminId)
        const admin = _admin instanceof Admin ? _admin : null;
        if(!admin){
            throw new NotFoundException("Admin Doesn't Exist")
        }
        await this.adminsRepo.remove(admin)
        return {message:"Admin deleted"}

    }

}
