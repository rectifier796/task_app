import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

interface Payload {
  username: string;
  password: string;
}

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req) => {
        // console.log(req.headers);
        // console.log(req.headers.authorization.split(' ')[1]);
        return req.headers.authorization.split(' ')[1];
      },
      secretOrKey: configService.getOrThrow('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: Payload) {
    // console.log(payload);
    return payload;
  }
}
