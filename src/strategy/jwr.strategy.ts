import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtPayload} from "./jwt-payload.interface";
import {UserService} from "../services/user.service";

import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt"
import { UserDto } from '../model';


@Injectable()
export class JwrStrategy extends PassportStrategy(Strategy) {

    constructor(private userService: UserService) {
        super({jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "topSecret51"
        });
    }

    private async validate(payLoad: JwtPayload): Promise<UserDto> {
        const {userName} = payLoad;
        const userDto = await this.userService.findByUserName(userName);
        if (!userDto) {
            throw new UnauthorizedException();
        }
        return userDto;
    }

}
