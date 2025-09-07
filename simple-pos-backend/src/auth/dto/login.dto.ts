import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {


    @IsNotEmpty()
    @IsEmail({}, {message: 'Please enter a valid email'})
    readonly email: string;

    @IsNotEmpty()
    @IsEmail()
    readonly password: string;

}