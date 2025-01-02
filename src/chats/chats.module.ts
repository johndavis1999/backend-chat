import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { Chat } from './chat.entity';
import { ChatMember } from '../chat-member/chat-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatMember])
  ],
  controllers: [ChatsController],
  providers: [ChatsService]
})
export class ChatsModule {}
