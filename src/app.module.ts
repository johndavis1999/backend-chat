import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { ContactsModule } from './contacts/contacts.module';
import { UserStatusGateway } from './user-status/user-status.gateway';
import { ChatGatewayGateway } from './chat-gateway/chat-gateway.gateway';
import { ChatsModule } from './chats/chats.module';
import { ChatMemberModule } from './chat-member/chat-member.module';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.db_host,
      port: +process.env.db_port,
      username: process.env.db_username,
      password: process.env.db_password,
      database: process.env.db_name,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ContactsModule,
    ChatsModule,
    ChatMemberModule
  ],
  controllers: [],
  providers: [UserStatusGateway, ChatGatewayGateway],
})
export class AppModule {}
