import { TaskService } from './services/task.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Team } from './entities/team.entity';
import { Member } from './entities/member.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './jwt_strategy/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { TaskController } from './controllers/task.controller';
import { TeamController } from './controllers/team.controller';
import { AuthService } from './services/auth.service';
import { TeamService } from './services/team.service';

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
  controllers: [AuthController, TaskController, TeamController],
  providers: [AuthService, TaskService, TeamService, JWTStrategy],
})
export class AppModule {}
