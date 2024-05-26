import {BadRequestException, Injectable} from '@nestjs/common';
import {LoginRequest} from "./requests/login.request";
import {AdminsService} from "../admins/admins.service";
import {Admin} from "../admins/entity/admin.entity";
import {JwtService} from "@nestjs/jwt";
import { UserContextService } from 'src/dataConfig/userContext/user-context.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly adminsService: AdminsService,
        private readonly jwtService: JwtService,
        private readonly userContextService: UserContextService
    ) {}

    /*
    1. get the user from db
    2. gen token
    .. send it in response
     */
    async login(body: LoginRequest) {
        const admin = await this.adminsService.getAdminByUserAndPassword(body.username,body.password);
        if (typeof admin === "boolean" && admin === false) {
            throw new BadRequestException({
                message: "Invalid credentials"
            })
        }
        const _admin = admin instanceof Admin ? admin : null;
        this.userContextService.setUsername(_admin.username);
        const token = await this.sign(_admin);
        return {
            user: {
                id: _admin.id,
                username: _admin.username,
                name: _admin.name,
                role: _admin.role
            },
            accessToken: token
        }
    }

    async sign(admin: Admin) {
        const payload = { id: admin.id, username: admin.username };
        return this.jwtService.sign(payload);
    }

    async register(body) {
        const admin = await this.adminsService.createAdmin(body);
        delete admin.password
        return admin
    }

    async getAdminInfo(user) {
        const admin = await this.adminsService.getAdminById(user.id);
        const _admin = admin instanceof Admin ? admin : null;
        delete _admin.password
        return _admin
    }

    async getAllAdmins(limit, page){
        return await this.adminsService.getAll(limit, page)
    }

    async getAdminById(adminId: number){
        return await this.adminsService.getAdminById(adminId);
    }

    async editAdmin(admin : Admin, adminId: number){
        return this.adminsService.editAdmin(admin, adminId)
    }
    async deleteAdmin(requestId:number){
        return this.adminsService.deleteAdmin(requestId)
    }
}
