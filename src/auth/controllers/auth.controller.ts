import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import { Request } from 'express';
import {AuthService} from "../auth.service";
import { JwtAuthGuard } from '../guards/jwtAuthGuard';
import {LoginRequest} from "../requests/login.request";

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

}
