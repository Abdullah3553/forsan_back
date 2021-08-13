import {BadRequestException, Injectable} from '@nestjs/common';
import {LoginRequest} from "./requests/login.request";
import {AdminsService} from "../admins/admins.service";
import {Admin} from "../admins/entity/admin.entity";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {

    constructor(
        private readonly adminsService: AdminsService,
        private readonly jwtService: JwtService,

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
        const token = await this.sign(_admin);
        return {
            data: {
                id: _admin.id,
                username: _admin.username,
                name: _admin.name
            },
            accessToken: token
        }
    }

    async sign(admin: Admin) {
        const payload = { id: admin.id, username: admin.username };
        return this.jwtService.sign(payload);
    }

    register(body) {
        return this.adminsService.createAdmin(body)
    }
}
