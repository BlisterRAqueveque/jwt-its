import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './configuration';
import { AuthMiddleware, UsersModule } from './users';
import * as express from 'express';
import { MulterModule } from '@nestjs/platform-express';
import { imgStorage } from './helpers';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    UsersModule,
    MulterModule.register({
      storage: imgStorage('').storage,
      fileFilter: imgStorage('').fileFilter,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        AuthMiddleware,
        express.json({ limit: '50mb' }),
        express.urlencoded({ limit: '50mb', extended: true }),
      )
      .exclude(
        {
          path: 'users/auth/login',
          method: RequestMethod.POST,
        },
        {
          path: 'users/auth/register',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('');
  }
}
