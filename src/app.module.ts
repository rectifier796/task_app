import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Team } from './entities/team.entity';
import { Member } from './entities/member.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './jwt_strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TypeOrmModule.forFeature([Task, Team, Member]),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async(configService: ConfigService)=>({
        secret: configService.getOrThrow('JWT_SECRET_KEY')
      }),
      inject:[ConfigService]
    })
  ],
  controllers: [AppController],
  providers: [AppService,JWTStrategy],
})
export class AppModule {}
