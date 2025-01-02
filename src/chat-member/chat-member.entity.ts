import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Chat } from 'src/chats/chat.entity';

@Entity('chat_members')
export class ChatMember {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => Chat, chat => chat.chatMembers) // Relación con el chat
    @JoinColumn({ name: 'chat_id' })
    chat: Chat;

    @ManyToOne(() => User, user => user.chatMembers) // Relación con el usuario
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}