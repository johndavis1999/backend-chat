import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Contact } from "src/contacts/contact.entity";
import { Exclude, Expose } from 'class-transformer';
import { Chat } from "src/chats/chat.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({unique: true})
    username: string

    @Exclude() // Excluye el campo password de las respuestas
    @Column()
    password: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({nullable: true})
    authStrategy: string

    @OneToMany(() => Contact, contact => contact.id_user)
    contacts: Contact[]

    @OneToMany(() => Chat, chat => chat.createdBy)
    chats: Chat[]
}