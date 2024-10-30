import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'The unique identifier of the patient. Must be a valid UUID.',
    example: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
  })
  @IsUUID('all')
  patientId: string;

  @ApiProperty({
    description: 'The unique identifier of the doctor. Must be a valid UUID.',
    example: 'a3f0a3e9-93b0-4a54-8d3e-6d9c3e673c34',
  })
  @IsUUID('all')
  doctorId: string;

  @ApiProperty({
    description: 'The date and time of the appointment in ISO 8601 format.',
    example: '2024-10-25 14:30',
  })
  @IsDateString()
  dateAndTime: string;
}
