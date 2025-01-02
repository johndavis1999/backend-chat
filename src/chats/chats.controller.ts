import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';

@Controller('chats')
@UseGuards(AuthGuard)
@UseInterceptors(TransformInterceptor)
export class ChatsController {

    constructor(private chatService: ChatsService) {}

    @Get('')
    index(){
        return this.chatService.index();
    }
}
