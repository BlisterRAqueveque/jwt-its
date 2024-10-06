import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@/configuration';
import { AuthService } from './auth/auth.service';
import { JwtGuard } from './auth/guards/auth.guard';
import { JwtStrategy } from './auth/strategies/auth.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register(jwtConfig)],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtStrategy, JwtGuard],
  exports: [UsersService, AuthService],
})
export class UsersModule {}
