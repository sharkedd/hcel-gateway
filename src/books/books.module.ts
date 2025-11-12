import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import appconfig from '../config/app.config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'BOOKS_SERVICE',
        imports: [ConfigModule],
        inject: [appconfig.KEY],
        useFactory: (config: ConfigType<typeof appconfig>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.amqp_uri],
            // 🔸 puedes usar la misma cola o una específica para libros:
            queue: process.env.RABBIT_BOOKS_QUEUE || config.book_queue,
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
