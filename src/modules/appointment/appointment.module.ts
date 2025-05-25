import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './models/appointment.entity';
import { DoctorsModule } from '../doctors/doctors.module';
import { PatientsModule } from '../patients/patients.module';
import { OfficesModule } from '../offices/offices.module';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, MailService],
  exports: [AppointmentService],
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    DoctorsModule,
    PatientsModule,
    OfficesModule,
  ],
})
export class AppointmentModule {}
