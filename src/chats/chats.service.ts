import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './chat.entity';
import { ChatMember } from '../chat-member/chat-member.entity';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,
        @InjectRepository(ChatMember) private chatMemberRepository: Repository<ChatMember>
    ) {}

    async index(userId: number){
        const chatMembers = await this.chatMemberRepository.find({
            where: { user: { id: userId } },
            relations: ['chat'],
        });

        const chatIds = chatMembers.map(chatMember => chatMember.chat.id);

        const chats = await this.chatRepository.find({
            where: {
                id: In(chatIds),
            },
            relations: ['chatMembers', 'chatMembers.user'],
        });

        // Mapeamos los chats para actualizar el nombre si el chat no es de grupo
        const updatedChats = chats.map(chat => {
            if (!chat.isGroup) {
                // Encontramos el miembro que no es el usuario en sesión
                const otherUser = chat.chatMembers.find(member => member.user.id !== userId);
                if (otherUser) {
                    chat.name = otherUser.user.username; // Asignamos el nombre del otro usuario al chat
                }
            }
            return chat;
        });
    
        return updatedChats;
    }

    async show(currentUserId: number, userId: number){

    }
}