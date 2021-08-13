import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "../auth.service";
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
}
