import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() requestUser: CreateUserDto) {
    return await this.usersService.create(requestUser);
  }

  @Get()
  async getUsers() {
    return await this.usersService.findAll();
  }
}
