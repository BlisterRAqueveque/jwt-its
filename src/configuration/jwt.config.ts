import { JwtModuleOptions } from '@nestjs/jwt';
import { envs } from './envs';

export const jwtConfig: JwtModuleOptions = {
  secret: envs.signature,
  signOptions: {
    expiresIn: envs.expire,
  },
};
