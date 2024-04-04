import { Body, Controller, Get, Post, Req, UseGuards, } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { SignInDto } from "src/dtos/auth.dto";
import { AuthService } from "src/services/auth.service";


@Controller()
export class AuthController{
    constructor(
        private readonly authService : AuthService
    ){}

    // Endpoint to get jwt token
    @Post('/login')
    async login(@Body() signInDto : SignInDto){
        return this.authService.getToken(signInDto);
    }

    // Endpoint to test jwt token
    @UseGuards(AuthGuard('jwt'))
    @Get('/test')
    async testing(@Req() req:Request){
        // console.log(req);
        return {authorized : true};
    }
}