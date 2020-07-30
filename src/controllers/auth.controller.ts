import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {AuthService} from "../services/auth.service";
import {AuthGuard} from "@nestjs/passport";
import { AuthDto } from '../model';

@Controller('auth')
@ApiTags("auth")
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post("/signin")
    async singIn(@Body() data: AuthDto): Promise<any> {
        const accessToken = await this.authService.signIn(data);
        return  {accessToken};
    }

    @Post("/test")
    @UseGuards(AuthGuard())
    test(@Req() req) {
        return req.user.name;
    }

}
