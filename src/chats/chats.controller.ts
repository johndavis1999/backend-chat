import { Controller, Get, Param, Request, UseGuards, UseInterceptors } from '@nestjs/common';
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
    async index(@Request() req){
        return this.chatService.index(req.user.id);
    }

    @Get(':userId')
    async show(
        @Request() req,
        @Param('userId') userId: number
    ){
        return this.chatService.show(req.user.id, userId);
    }
}
