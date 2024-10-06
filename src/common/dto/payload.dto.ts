import { Role } from '@/users/dto/role.enum';

export class PayloadJwt {
  sub: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: Role;
}
