import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMember } from './chat-member.entity';
import { ChatMemberService } from './chat-member.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatMember])
    ],
    providers: [ChatMemberService],
})
export class ChatMemberModule {}
