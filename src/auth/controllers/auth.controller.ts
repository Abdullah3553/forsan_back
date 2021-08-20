import {Body, Controller, Delete, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import { Request } from 'express';
import {AuthService} from "../auth.service";
import { JwtAuthGuard } from '../guards/jwtAuthGuard';
import {LoginRequest} from "../requests/login.request";
import {Admin} from "../../admins/entity/admin.entity";

@Controller('auth')
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


    @UseGuards(JwtAuthGuard)
    @Get("/me")
    async getAdminInfo(@Req() req: Request) {
        return this.authService.getAdminInfo(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/allAdmins')
    getAllAdmins(){
        return this.authService.getAllAdmins()
    }
    @UseGuards(JwtAuthGuard)
    @Post("/editAdmin")
    editAdmin(@Body() body:Admin){
        return this.authService.editAdmin(body)
    }
    @UseGuards(JwtAuthGuard)
    @Delete("/deleteAdmin/:id")
    deleteAdmin(@Param() params){
        return this.authService.deleteAdmin(params.id)
    }
}
