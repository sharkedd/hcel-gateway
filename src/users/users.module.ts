import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import appconfig from '../config/app.config';
import { ConfigType } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => AuthModule), // ✅ mantiene la referencia diferida
    ClientsModule.registerAsync([
      {
        name: 'USERS_SERVICE',
        imports: [ConfigModule],
        inject: [appconfig.KEY],
        useFactory: (config: ConfigType<typeof appconfig>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.amqp_uri],
            queue: config.user_queue,
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, ClientsModule],
})
export class UsersModule {}
