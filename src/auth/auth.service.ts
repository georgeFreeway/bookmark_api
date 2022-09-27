/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {};

    //sign up
    async signup(dto: AuthDto) {
        try{
            //hash user password
            const hash = await argon.hash(dto.password);
            
            //save the user 
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                }
            });

            //return user token
            return this.signToken(user.id, user.email);

        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException('Email already taken!');
                }
            }
            //not an instance of the prisma client error
            throw error;
        }
    }

    //sign in
    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            },
        });

        if(!user){
            throw new ForbiddenException('Email does not exist');
        }

        const pwdMatches = await argon.verify(user.hash, dto.password);

        if(!pwdMatches){
            throw new ForbiddenException('Wrong Password');
        }

        //return user token
        return this.signToken(user.id, user.email);
    }

    //signing a token
    async signToken(userId: number, email: string): Promise<{ accessToken: string }> {
        //payload
        const payload = { sub: userId, email }

        //secret string
        const secretString = this.config.get('SECRET_STRING');

        //sign the token 
        const token = await this.jwt.signAsync(
            payload, {
                expiresIn: '15m',
                secret: secretString
            },
        );

        return {
            accessToken: token,
        };
    };
     

}