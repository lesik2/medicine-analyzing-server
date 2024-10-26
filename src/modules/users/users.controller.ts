import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { AppRoles } from '@/decorators/roles-decorator';
import { Roles } from '@/types';
import { RolesGuard } from '@/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AppRoles([Roles.MANAGER])
  async getUsers() {
    return await this.usersService.findAll();
  }
}
