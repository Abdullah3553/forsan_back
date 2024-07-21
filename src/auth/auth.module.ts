import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import {AdminsModule} from "../admins/admins.module";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {JWT_SECRET} from "../core/config";
import {JwtStrategy} from "./jwtStrategy";
import { UserContextModule } from 'src/dataConfig/userContext/user-context.module';

@Module({
  imports: [
      AdminsModule,
      JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: "7d" },
      }),
      PassportModule,
      UserContextModule
  ],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
