import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}
    
    async register({username, password}: RegisterDto) {
        const user = await this.userService.findByUsername(username);
        if(user){
            throw new BadRequestException('El usuario ya existe');
        }
        return await this.userService.store({
            username, 
            password: await bcryptjs.hash(password, 10)
        });
    }

    async login({username, password}: RegisterDto) {
        const user = await this.userService.findByUsername(username);
        if(!user){
            throw new UnauthorizedException('El usuario no existe');
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('El usuario no existe');
        }

        const payload = { id: user.id, 
            username: user.username
        }
        const token = await this.jwtService.signAsync(payload);

        return {
            username,
            token
        };
    }
}