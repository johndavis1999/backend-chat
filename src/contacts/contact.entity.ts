import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Expose } from 'class-transformer';

@Entity('contactos')  // Nombre de la tabla
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.contacts)
    @JoinColumn({ name: 'id_user' })
    id_user: User;

    @ManyToOne(() => User, user => user.contacts)
    @JoinColumn({ name: 'id_contact' })
    @Expose() // Expose the id_contact
    id_contact: User;
}