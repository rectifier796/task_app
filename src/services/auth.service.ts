import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from 'src/dtos/auth.dto';

interface Credentials{
  username:string;
  password:string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getToken(signInDto: SignInDto) {
    const payload : Credentials = {
      username: this.configService.getOrThrow('TOKEN_USERNAME'),
      password: this.configService.getOrThrow('TOKEN_PASSWORD'),
    };

    if(signInDto.username !== payload.username || signInDto.password !== payload.password){
      throw new UnauthorizedException("Invalid Credentials");
    }
    // console.log(payload);
    return { token: this.jwtService.sign({username : payload.username}) };
  }
}
