import { IsDateString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID('all')
  patientId: string;

  @IsUUID('all')
  doctorId: string;

  @IsDateString()
  dateAndTime: string;
}
