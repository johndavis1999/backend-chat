import { IsNumber } from "class-validator"

export class CreateContactDto {
    @IsNumber()
    id_contact: number
}