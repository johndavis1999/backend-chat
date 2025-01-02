import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatMemberDto } from './dto/create-chat-member.dto';
import { ChatMember } from './chat-member.entity';

@Injectable()
export class ChatMemberService {
    constructor(
        @InjectRepository(ChatMember) private chatMemberRepository: Repository<ChatMember>
    ) {}

    async create(){
        
    }
}