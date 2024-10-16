import { AppRoles } from '@/decorators/roles-decorator';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/types';
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

  @Patch()
  async update(@Body() updateOfficeDto: UpdateDoctorDto) {
    return await this.doctorsService.update(updateOfficeDto);
  }

  @Get(':id')
  async findOne(@Param() params: IdParams) {
    return await this.doctorsService.findOne(params.id);
  }
}
