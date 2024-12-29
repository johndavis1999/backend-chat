import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { Contact } from "./contact.entity";
import { User } from "src/users/user.entity";
import { ContactController } from "./contacts.controller";
import { ContactService } from "./contacts.service";

 @Module({
   imports: [
      TypeOrmModule.forFeature([Contact, User]),
      UsersModule
   ],
   providers: [ContactService],
   controllers: [ContactController],
   exports: [ContactService]
 })
 export class ContactsModule{}