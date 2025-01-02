import { IsBoolean, IsOptional, IsString } from "class-validator"

export class CreateChatDto {
    @IsOptional()
    @IsString()
    name: string

    @IsBoolean()
    isGroup: boolean
}