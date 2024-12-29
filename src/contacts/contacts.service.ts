import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contact } from "./contact.entity";
import { Repository } from "typeorm";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/user.entity";
import { CreateContactDto } from "./dto/create-contact.dto";

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact) private contactRepository: Repository<Contact>,
        private usersService: UsersService,

    ) {}

    async index(id: number){
        const user = await this.usersService.findUser(id);
        const contacts = await this.contactRepository.find({
            where: { id_user: { id: user.id } },
            relations: ['id_contact'],
        });
        return contacts;
    }

    async create(userId, {id_contact}: CreateContactDto) {
        const user = await this.usersService.findUser(userId);
        const userContact = await this.usersService.findUser(id_contact);

        const contact = this.contactRepository.create({
            id_user: user,
            id_contact: userContact,
        });

        await this.contactRepository.save(contact);
    
        return contact;
    }
}