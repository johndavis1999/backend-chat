import { IsInt } from "class-validator"

export class CreateChatMemberDto {
    @IsInt()
    chatId: number;

    @IsInt()
    userId: number;
}