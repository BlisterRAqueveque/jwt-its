import { User } from '@/users/entities/user.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { AuthService } from '../auth.service';
import { UsersService } from '@/users/users.service';

export interface RequestModel {
  user: User;
  headers: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  async use(
    req: RequestModel,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ');
      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);

      const user = await this.userService.findOne(
        decodedToken.sub,
      );

      if (decodedToken) {
        if (user.id == decodedToken.sub) next();
        else throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (e) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
