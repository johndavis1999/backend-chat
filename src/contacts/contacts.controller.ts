import { Body, Controller, Get, Post, Request, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { ContactService } from "./contacts.service";
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { CreateContactDto } from "./dto/create-contact.dto";

@Controller('contacts')
@UseGuards(AuthGuard)
@UseInterceptors(TransformInterceptor)
export class ContactController {

    constructor(private contactService: ContactService) {}

    @Get('')
    index(@Request() req){
        return this.contactService.index(req.user.id);
    }

    @Post('')
    create(
        @Request() req,
        @Body() createContactDto: CreateContactDto
    ){
        return this.contactService.create(req.user.id, createContactDto);
    }
}