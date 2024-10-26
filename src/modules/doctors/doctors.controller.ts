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
import { IdParams } from '@/types/params';
import { UpdateDoctorDto } from './dto/update-office-dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllDoctorsQueryDto } from './dto/get-all-doctors-query-dto';
import { GetAllDoctorsResponseDto } from './dto/get-all-doctors-response-dto';
import { DoctorResponseDto } from './dto/doctor-response-dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('doctors')
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
  @ApiOperation({ summary: 'Retrieve all doctors with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of doctors retrieved successfully.',
    type: GetAllDoctorsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. The input data is invalid.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No doctors match the provided filters.',
  })
  async findAllFilters(
    @Query() query: GetAllDoctorsQueryDto,
  ): Promise<GetAllDoctorsResponseDto> {
    return await this.doctorsService.findAllFilters(query);
  }

  @AppRoles([Roles.USER])
  @Get('/specialty/:specialty')
  @ApiOperation({ summary: 'Retrieve doctors by specialty' })
  @ApiParam({
    name: 'specialty',
    description: 'The specialty of the doctors to retrieve.',
    required: true,
    enum: Specialty,
  })
  @ApiResponse({
    status: 200,
    description: 'List of doctors retrieved successfully.',
    type: [DoctorResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No doctors found for the specified specialty.',
  })
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
  @ApiOperation({
    summary:
      'Retrieve a specific doctor by ID along with their available shifts',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the doctor.',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Doctor retrieved successfully, along with available shifts.',
    type: DoctorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. Doctor with the specified ID does not exist.',
  })
  async findOne(@Param() params: IdParams) {
    return await this.doctorsService.findOneDoctorWithAvailableShifts(
      params.id,
    );
  }
}
