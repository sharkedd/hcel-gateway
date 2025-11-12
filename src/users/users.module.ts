import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import appconfig from '../config/app.config';
import { ConfigType } from '@nestjs/config'; // <--- importa esto

@Module({
  imports: [
    ConfigModule,

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
})
export class UsersModule {}
