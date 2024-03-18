import {Body, Controller, Delete, Get, Param, Post, Req, UseGuards, Query} from '@nestjs/common';
import { Request } from 'express';
import {AuthService} from "../auth.service";
import { JwtAuthGuard } from '../guards/jwtAuthGuard';
import {LoginRequest} from "../requests/login.request";
import {Admin} from "../../admins/entity/admin.entity";

@Controller('auth')
@UseGuards(JwtAuthGuard)

export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post("login")
    login(@Body() body: LoginRequest) {
        return this.authService.login(body)
    }

    @Post("register")
    register(@Body() body) {
        return this.authService.register(body);
    }


    @Get("/me")
    async getAdminInfo(@Req() req: Request) {
        return this.authService.getAdminInfo(req.user);
    }

    @Get('/allAdmins')
    getAllAdmins(@Query() {limit, page}){
        return this.authService.getAllAdmins(limit, page)
    }

    @Get('/:id')
    getAdminById(@Param() params){
        return this.authService.getAdminById(params.id)
    }

    @Post("/editAdmin/:id")
    editAdmin(@Body() body:Admin, @Param() params){
        return this.authService.editAdmin(body, params.id)
    }

    @Delete("/deleteAdmin/:id")
    deleteAdmin(@Param() params){
        return this.authService.deleteAdmin(params.id)
    }
}
