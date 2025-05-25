import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { AppRoles } from '@/decorators/roles-decorator';
import { Roles } from '@/types';
import { getWorkloadQuery } from './types';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment-dto';
import { CurrentUser } from '@/decorators/current-user-decorator';
import { ExcludeUserPassword } from '@/types/excludeUserPassword';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTimeSlotsQueryDto } from './dto/get-time-slots-query-dto';
import { AppointmentResponseByPatientDto } from './dto/appointment-response-by-patient-dto';
import { Appointment } from './models/appointment.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  @AppRoles([Roles.USER])
  @ApiOperation({ summary: 'Retrieve available time slots' })
  @ApiResponse({
    status: 200,
    description: 'List of available time slots retrieved successfully.',
    example: ['12:30', '12:45', '13:00'],
  })
  @ApiResponse({
    status: 404,
    description: 'No available time slots found for the specified criteria.',
  })
  async getTimeSlots(@Query() query: GetTimeSlotsQueryDto) {
    return await this.appointmentService.getTimeSlots(query);
  }

  @Delete(':id')
  @AppRoles([Roles.USER])
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiResponse({
    status: 200,
    description: 'Appointment canceled successfully.',
    type: Appointment,
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found.',
  })
  async cancelAppointment(
    @Param('id') id: string,
    @CurrentUser() user: ExcludeUserPassword,
  ): Promise<Appointment> {
    return await this.appointmentService.cancelAppointment(id, user);
  }

  @Get('workload')
  @AppRoles([Roles.MANAGER])
  async getWorkload(@Query() query: getWorkloadQuery) {
    return await this.appointmentService.getWorkload(query);
  }

  @Post()
  @AppRoles([Roles.USER])
  async create(
    @CurrentUser() user: ExcludeUserPassword,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentService.createAppointmentDto(
      user,
      createAppointmentDto,
    );
  }

  @Get('/patients')
  @AppRoles([Roles.USER])
  @ApiOperation({ summary: 'Retrieve all appointments for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Appointments retrieved successfully.',
    type: AppointmentResponseByPatientDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No appointments found for the specified user.',
  })
  async getAppointments(@CurrentUser() user: ExcludeUserPassword) {
    return await this.appointmentService.getAppointments(user.id);
  }
}
