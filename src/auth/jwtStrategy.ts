import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import {JWT_SECRET} from "../core/config";
import {AdminsService} from "../admins/admins.service";
import {Admin} from "../admins/entity/admin.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly adminsService: AdminsService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET
        });
    }

    async validate(payload: any) {
        const user_id = payload.id
        const admin = await this.adminsService.getAdminById(user_id);
        if (typeof admin === "boolean" && admin === false) {
            throw new UnauthorizedException();
        } else {
            const _admin = admin instanceof Admin ? admin : null;
            return {id: _admin.id, username: _admin.username }
        }
    }

}


/*
{
id: user_id
username:
}
 */

/*
1. get token from header
2. validate signature
3. validate expire time
4. check if the user in the db
 */

