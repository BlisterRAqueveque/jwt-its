import { AuthService, Role, UsersService } from '@/users';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'].split(' ')[1];

    const decodedToken = await this.auth.verifyJwt(token);

    const user = await this.userService.findOne(decodedToken.sub);

    if (user.role === Role.admin) return true;
    else return false;
  }
}
