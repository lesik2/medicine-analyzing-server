import { AppRoles } from '@/decorators/roles-decorator';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles, Specialty } from '@/types';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { CreateDoctorDto } from './dto/create-doctor-dto';
import { DoctorsService } from './doctors.service';
import { getAllDoctorsQuery } from './types';
import { IdParams } from '@/types/params';
import { UpdateDoctorDto } from './dto/update-office-dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @AppRoles([Roles.MANAGER])
  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    return await this.doctorsService.create(createDoctorDto);
  }

  @AppRoles([Roles.MANAGER])
  @Get()
  async findAllFilters(@Query() query: getAllDoctorsQuery) {
    return await this.doctorsService.findAllFilters(query);
  }

  @AppRoles([Roles.USER])
  @Get('/specialty/:specialty')
  async findDoctorsBySpecialty(@Param('specialty') specialty: Specialty) {
    return await this.doctorsService.findDoctorsBySpecialty(specialty);
  }

  @AppRoles([Roles.MANAGER])
  @Patch()
  async update(@Body() updateOfficeDto: UpdateDoctorDto) {
    return await this.doctorsService.update(updateOfficeDto);
  }

  @AppRoles([Roles.MANAGER])
  @Get(':id')
  async findOne(@Param() params: IdParams) {
    return await this.doctorsService.findOneDoctorWithAvailableShifts(
      params.id,
    );
  }
}
