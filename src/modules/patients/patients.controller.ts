import { AppRoles } from '@/decorators/roles-decorator';
import { Roles } from '@/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { CreatePatientDto } from './dto/create-patient-dto';
import { CurrentUser } from '@/decorators/current-user-decorator';
import { PatientsService } from './patients.service';
import { ExcludeUserPassword } from '@/types/excludeUserPassword';
import { Patient } from './models/patient.entity';
import { UpdatePatientDto } from './dto/update-patient-dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@AppRoles([Roles.USER])
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  async create(
    @CurrentUser() user: ExcludeUserPassword,
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    return await this.patientsService.create(createPatientDto, user.id);
  }

  @Patch()
  async update(@Body() updatePatientDto: UpdatePatientDto) {
    return await this.patientsService.update(updatePatientDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.patientsService.delete(id);
  }

  @Get()
  async findAll(@CurrentUser() user: ExcludeUserPassword) {
    return await this.patientsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: ExcludeUserPassword,
    @Param() params: any,
  ) {
    return await this.patientsService.findOne(user.id, params.id);
  }
}
