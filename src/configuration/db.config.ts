import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envs } from './envs';

export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: envs.db_url,
  synchronize: true,
  autoLoadEntities: true,
};
