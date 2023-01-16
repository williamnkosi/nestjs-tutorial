import {
    Controller, Post, Get, Patch, Delete, Param, Body, Query, NotFoundException
    , UseInterceptors, ClassSerializerInterceptor, Session
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
@Serialize(UserDto)
@Controller('auth')
export class UsersController {

    constructor(private userService: UsersService
        , private authService:AuthService) { }

    
    @Get('/whoami')
    whoAmI(@Session() session: any){
        return this.userService.findOne(session.userId)
    }

    @Post('signout')
    signOut(@Session() session:any){
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session) {
        const user = await this.authService.signup(body.email, body.password)
        session.userId= user.id;
        return user
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto,@Session() session){
        const user = await this.authService.signin(body.email, body.password)
        session.userId= user.id;
        return user
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
