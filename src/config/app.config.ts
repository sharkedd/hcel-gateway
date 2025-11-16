import { registerAs } from '@nestjs/config';

export default registerAs('appconfig', () => ({
  app_port: process.env.PORT || 3000,
  amqp_uri: process.env.AMQP_URI || 'amqp://localhost:5672',
  book_queue: process.env.RABBIT_BOOK_QUEUE || 'hcel_stories_queue',
  user_queue: process.env.RABBIT_USER_QUEUE || 'hcel_users_queue',
  jwt_secret: process.env.JWT_SECRET || 'supersecret',
}));
