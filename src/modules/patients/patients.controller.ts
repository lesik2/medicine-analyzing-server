import { AppRoles } from '@/decorators/roles-decorator';
import { Roles } from '@/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { IdParams } from '@/types/params';
import { ChangeActiveDto } from './dto/change-active-dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatientsResponseDto } from './dto/patients-response-dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@AppRoles([Roles.USER])
@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({
    status: 201,
    description: 'The patient has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. The input data is invalid.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. User needs to be authenticated.',
  })
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

  @Patch('/active')
  async changeActive(@Body() changeActiveDto: ChangeActiveDto) {
    return await this.patientsService.changeActive(changeActiveDto.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific patient by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the patient to be deleted.',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Patient deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. Patient with the specified ID does not exist.',
  })
  async delete(@Param('id') id: string) {
    return await this.patientsService.delete(id);
  }

  @Get('/pattern')
  async findAllPattern(@CurrentUser() user: ExcludeUserPassword) {
    return await this.patientsService.findAllPattern(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all patients' })
  @ApiResponse({
    status: 200,
    description: 'List of patients retrieved successfully.',
    type: PatientsResponseDto,
  })
  async findAll(@CurrentUser() user: ExcludeUserPassword) {
    return await this.patientsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific patient by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the patient.',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. Patient with the specified ID does not exist.',
  })
  async findOne(@Param() params: IdParams) {
    return await this.patientsService.findOne(params.id);
  }
}
