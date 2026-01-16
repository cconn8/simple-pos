import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userModel;
    private usersService;
    private jwtService;
    constructor(userModel: Model<User>, usersService: UsersService, jwtService: JwtService);
    signUp(signUpDto: SignUpDto): Promise<{
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
}
