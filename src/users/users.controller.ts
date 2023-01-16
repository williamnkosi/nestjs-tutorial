import {
    Controller, Post, Get, Patch, Delete, Param, Body, Query, NotFoundException
    , UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
@Serialize(UserDto)
@Controller('auth')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        this.userService.create(body.email, body.password)
    }

   
    @Get("/:id")
    async findUser(@Param("id") id: string) {
        console.log("handler is running")
        const user = await this.userService.findOne(parseInt(id))
        if (!user) {
            throw new NotFoundException("User not found")
        }
        return user
    }

    @Get()
    findAllUsers(@Query("email") email: string) {
        return this.userService.find(email)
    }

    @Delete("/:id")
    removeUser(@Param("id") id: string) {
        return this.userService.remove(parseInt(id))
    }

    @Patch("/:id")
    updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(parseInt(id), body)
    }
}
