import { AppRoles } from '@/decorators/roles-decorator';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/types';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { CreateDoctorDto } from './dto/create-doctor-dto';
import { DoctorsService } from './doctors.service';
import { getAllDoctorsQuery } from './types';

@UseGuards(JwtAuthGuard, RolesGuard)
@AppRoles([Roles.MANAGER])
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    return await this.doctorsService.create(createDoctorDto);
  }

  @Get()
  async findAll(@Query() query: getAllDoctorsQuery) {
    return await this.doctorsService.findAll(query);
  }
}
