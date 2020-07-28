import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "./user.service";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import { AuthDto } from '../model';
import { JwtPayload } from '../strategy/jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(private userService: UserService, private jwtService: JwtService) {
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    async signIn(authDto: AuthDto): Promise<string> {
        if (!await this.validatePassword(authDto.userName, authDto.password)) {
            throw new UnauthorizedException("Username or password not valid!");
        }

        const payLoad:JwtPayload = {
            userName: authDto.userName,
        };
        const accesToken = await this.jwtService.sign(payLoad);
        return accesToken;
    }

    private async validatePassword(username: string, password: string): Promise<boolean> {
        const userDto = await this.userService.findByUserName(username);
        if (!userDto) {
            return false;
        }
        const hash = await this.hashPassword(password, userDto.salt);
        return hash === userDto.password;
    }

}
