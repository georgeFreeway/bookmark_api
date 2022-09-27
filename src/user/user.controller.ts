/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    @Get('me')
    getUser(@GetUser() user: User): object {
        delete user.hash;
        return user;
    }

    @Patch()
    editUser(@GetUser('id') userid: number, @Body() dto: EditUserDto){
        return this.userService.editUser(userid, dto);
    }
}
