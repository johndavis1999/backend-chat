import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.chats) // Relación con el usuario que creó el chat
    @JoinColumn({ name: 'created_by' }) // Definir el nombre de la columna de la FK
    createdBy: User;

    @Column({ nullable: true })
    name: string;

    @Column({ default: false })
    isGroup: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}