import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { AppRoles } from '@/decorators/roles-decorator';
import { Roles } from '@/types';
import { getTimeSlotsQuery, getWorkloadQuery } from './types';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment-dto';
import { CurrentUser } from '@/decorators/current-user-decorator';
import { ExcludeUserPassword } from '@/types/excludeUserPassword';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  @AppRoles([Roles.USER])
  async getTimeSlots(@Query() query: getTimeSlotsQuery) {
    return await this.appointmentService.getTimeSlots(query);
  }

  @Get('workload')
  @AppRoles([Roles.MANAGER])
  async getWorkload(@Query() query: getWorkloadQuery) {
    return await this.appointmentService.getWorkload(query);
  }

  @Post()
  @AppRoles([Roles.USER])
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return await this.appointmentService.createAppointmentDto(
      createAppointmentDto,
    );
  }

  @Get('/patients')
  @AppRoles([Roles.USER])
  async getAppointments(@CurrentUser() user: ExcludeUserPassword) {
    return await this.appointmentService.getAppointments(user.id);
  }
}
