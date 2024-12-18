import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './models/appointment.entity';
import { DoctorsModule } from '../doctors/doctors.module';
import { PatientsModule } from '../patients/patients.module';
import { OfficesModule } from '../offices/offices.module';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    DoctorsModule,
    PatientsModule,
    OfficesModule,
  ],
})
export class AppointmentModule {}
